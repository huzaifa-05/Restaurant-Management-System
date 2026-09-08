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
  if (!config.paymentsTableName) throw new Error("PAYMENTS_TABLE_NAME is required");
  return config.paymentsTableName;
}

function toPayment(item) {
  if (!item) return null;
  const { PK, SK, GSI1PK, GSI1SK, ...payment } = item;
  return payment;
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

class PaymentRepository {
  async create(payment) {
    const item = {
      ...payment,
      PK: `PAYMENT#${payment.paymentId}`,
      SK: "PAYMENT",
      GSI1PK: `ORDER#${payment.orderId}`,
      GSI1SK: `${payment.createdAt}#${payment.paymentId}`,
      updatedAt: payment.createdAt
    };
    await client.send(new PutCommand({ TableName: tableName(), Item: item }));
    return toPayment(item);
  }

  async findById(paymentId) {
    const result = await client.send(new GetCommand({
      TableName: tableName(),
      Key: { PK: `PAYMENT#${paymentId}`, SK: "PAYMENT" }
    }));
    return toPayment(result.Item);
  }

  async findByOrder(orderId) {
    const items = await queryAll({
      TableName: tableName(),
      IndexName: "GSI1",
      KeyConditionExpression: "GSI1PK = :pk",
      ExpressionAttributeValues: { ":pk": `ORDER#${orderId}` }
    });
    return items.map(toPayment);
  }

  async findSuccessfulByOrder(orderId) {
    const payments = await this.findByOrder(orderId);
    return payments.find((payment) => payment.status === "SUCCESS") || null;
  }

  async update(paymentId, updates) {
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
        Key: { PK: `PAYMENT#${paymentId}`, SK: "PAYMENT" },
        UpdateExpression: `SET ${assignments.join(", ")}`,
        ConditionExpression: "attribute_exists(PK)",
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
        ReturnValues: "ALL_NEW"
      }));
      return toPayment(result.Attributes);
    } catch (err) {
      if (err.name === "ConditionalCheckFailedException") return null;
      throw err;
    }
  }
}

module.exports = { PaymentRepository };
