const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand
} = require("@aws-sdk/lib-dynamodb");
const { config } = require("../config");

const client = DynamoDBDocumentClient.from(new DynamoDBClient({ endpoint: config.dynamoDbEndpoint }), {
  marshallOptions: { removeUndefinedValues: true }
});

function tableName() {
  if (!config.usersTableName) throw new Error("USERS_TABLE_NAME is required");
  return config.usersTableName;
}

function toUser(item) {
  if (!item) return null;
  const { PK, SK, GSI1PK, GSI1SK, ...user } = item;
  return user;
}

class UserRepository {
  async create(user) {
    const item = {
      ...user,
      PK: `USER#${user.id}`,
      SK: "PROFILE",
      GSI1PK: `COGNITO#${user.cognitoSub}`,
      GSI1SK: `USER#${user.id}`
    };
    await client.send(new PutCommand({
      TableName: tableName(),
      Item: item,
      ConditionExpression: "attribute_not_exists(PK) AND attribute_not_exists(SK)"
    }));
    return toUser(item);
  }

  async findById(id) {
    const result = await client.send(new GetCommand({
      TableName: tableName(),
      Key: { PK: `USER#${id}`, SK: "PROFILE" }
    }));
    return toUser(result.Item);
  }

  async findByCognitoSub(cognitoSub) {
    const result = await client.send(new QueryCommand({
      TableName: tableName(),
      IndexName: "GSI1",
      KeyConditionExpression: "GSI1PK = :pk",
      ExpressionAttributeValues: { ":pk": `COGNITO#${cognitoSub}` },
      Limit: 1
    }));
    return toUser(result.Items?.[0]);
  }

  async findCurrent(identifier) {
    return (await this.findByCognitoSub(identifier)) || (await this.findById(identifier));
  }

  async updateById(id, updates) {
    const fields = Object.entries(updates).filter(([, value]) => value !== undefined);
    if (!fields.length) return this.findById(id);

    const names = {};
    const values = {};
    const assignments = fields.map(([field, value], index) => {
      const name = `#field${index}`;
      const valueName = `:value${index}`;
      names[name] = field;
      values[valueName] = value;
      return `${name} = ${valueName}`;
    });

    try {
      const result = await client.send(new UpdateCommand({
        TableName: tableName(),
        Key: { PK: `USER#${id}`, SK: "PROFILE" },
        UpdateExpression: `SET ${assignments.join(", ")}`,
        ConditionExpression: "attribute_exists(PK)",
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
        ReturnValues: "ALL_NEW"
      }));
      return toUser(result.Attributes);
    } catch (err) {
      if (err.name === "ConditionalCheckFailedException") return null;
      throw err;
    }
  }

  async updateByCognitoSub(cognitoSub, updates) {
    const user = await this.findByCognitoSub(cognitoSub);
    return user ? this.updateById(user.id, updates) : null;
  }

  async updateCurrent(identifier, updates) {
    const user = await this.findCurrent(identifier);
    return user ? this.updateById(user.id, updates) : null;
  }
}

module.exports = { UserRepository };
