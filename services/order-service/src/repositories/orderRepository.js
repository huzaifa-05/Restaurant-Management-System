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
  if (!config.ordersTableName) throw new Error("ORDERS_TABLE_NAME is required");
  return config.ordersTableName;
}

function toOrder(item) {
  if (!item) return null;
  const { PK, SK, GSI1PK, GSI1SK, GSI2PK, GSI2SK, ...order } = item;
  return order;
}

async function queryAll(request) {
  const items = [];
  let ExclusiveStartKey;
  do {
    const result = await client.send(new QueryCommand({ ...request, ExclusiveStartKey }));
    items.push(...(result.Items || []));
    ExclusiveStartKey = result.LastEvaluatedKey;
  } while (ExclusiveStartKey);
  return items;
}

class OrderRepository {
  async create(order) {
    const item = {
      ...order,
      PK: `ORDER#${order.orderId}`,
      SK: "ORDER",
      GSI1PK: order.customerUserId ? `CUSTOMER#${order.customerUserId}` : undefined,
      GSI1SK: order.customerUserId ? `${order.createdAt}#${order.orderId}` : undefined,
      GSI2PK: "ALL_ORDERS",
      GSI2SK: `${order.createdAt}#${order.orderId}`
    };
    await client.send(new PutCommand({ TableName: tableName(), Item: item }));
    return toOrder(item);
  }

  async findAll() {
    const items = await queryAll({
      TableName: tableName(),
      IndexName: "GSI2",
      KeyConditionExpression: "GSI2PK = :pk",
      ExpressionAttributeValues: { ":pk": "ALL_ORDERS" },
      ScanIndexForward: false
    });
    return items.map(toOrder);
  }

  async findById(orderId) {
    const result = await client.send(new GetCommand({
      TableName: tableName(),
      Key: { PK: `ORDER#${orderId}`, SK: "ORDER" }
    }));
    return toOrder(result.Item);
  }

  async findByUser(userId) {
    const items = await queryAll({
      TableName: tableName(),
      IndexName: "GSI1",
      KeyConditionExpression: "GSI1PK = :pk",
      ExpressionAttributeValues: { ":pk": `CUSTOMER#${userId}` },
      ScanIndexForward: false
    });
    return items.map(toOrder);
  }

  async update(orderId, updates) {
    const fields = Object.entries({ ...updates, updatedAt: new Date().toISOString() })
      .filter(([, value]) => value !== undefined);
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
        Key: { PK: `ORDER#${orderId}`, SK: "ORDER" },
        UpdateExpression: `SET ${assignments.join(", ")}`,
        ConditionExpression: "attribute_exists(PK)",
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
        ReturnValues: "ALL_NEW"
      }));
      return toOrder(result.Attributes);
    } catch (err) {
      if (err.name === "ConditionalCheckFailedException") return null;
      throw err;
    }
  }
}

module.exports = { OrderRepository };
