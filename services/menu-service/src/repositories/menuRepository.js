const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  DeleteCommand,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand
} = require("@aws-sdk/lib-dynamodb");
const { config } = require("../config");

const client = DynamoDBDocumentClient.from(new DynamoDBClient({ endpoint: config.dynamoDbEndpoint }), {
  marshallOptions: { removeUndefinedValues: true }
});

const createdAt = new Date().toISOString();

const seedItems = [
  {
    id: "burger-classic",
    name: "Classic Beef Burger",
    category: "Beef Burgers",
    description: "Juicy beef patty, cheddar, lettuce, tomato, pickles, and Foodie WE sauce.",
    price: 8.99,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80",
    available: true,
    featured: true,
    createdAt
  },
  {
    id: "burger-double-smash",
    name: "Double Beef Smash Burger",
    category: "Beef Burgers",
    description: "Two crispy-edged beef patties with melted cheese and caramelized onions.",
    price: 11.49,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80",
    available: true,
    featured: true,
    createdAt
  },
  {
    id: "burger-bbq",
    name: "BBQ Beef Burger",
    category: "Beef Burgers",
    description: "Smoky barbecue glaze, beef patty, onion rings, cheddar, and slaw.",
    price: 10.25,
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=900&q=80",
    available: true,
    featured: false,
    createdAt
  },
  {
    id: "burger-mushroom",
    name: "Mushroom Beef Burger",
    category: "Beef Burgers",
    description: "Sauteed mushrooms, Swiss cheese, garlic mayo, and a flame-grilled patty.",
    price: 10.75,
    image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=900&q=80",
    available: true,
    featured: false,
    createdAt
  },
  {
    id: "pizza-pepperoni",
    name: "Pepperoni Pizza",
    category: "Pizza",
    description: "Classic pepperoni, mozzarella, oregano, and bright tomato sauce.",
    price: 13.99,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=900&q=80",
    available: true,
    featured: true,
    createdAt
  },
  {
    id: "pizza-chicken-fajita",
    name: "Chicken Fajita Pizza",
    category: "Pizza",
    description: "Spiced chicken, bell peppers, onions, mozzarella, and fajita sauce.",
    price: 14.49,
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=900&q=80",
    available: true,
    featured: true,
    createdAt
  },
  {
    id: "pizza-cheese-lover",
    name: "Cheese Lover Pizza",
    category: "Pizza",
    description: "A golden blend of mozzarella, cheddar, parmesan, and creamy sauce.",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=900&q=80",
    available: true,
    featured: false,
    createdAt
  },
  {
    id: "pizza-bbq",
    name: "BBQ Pizza",
    category: "Pizza",
    description: "Chicken, onions, smoky barbecue sauce, cilantro, and melted mozzarella.",
    price: 14.25,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80",
    available: true,
    featured: false,
    createdAt
  },
  {
    id: "pasta-alfredo",
    name: "Chicken Alfredo Pasta",
    category: "Pasta",
    description: "Fettuccine, grilled chicken, parmesan, and a silky Alfredo sauce.",
    price: 12.49,
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=900&q=80",
    available: true,
    featured: true,
    createdAt
  },
  {
    id: "pasta-mushroom",
    name: "Creamy Mushroom Pasta",
    category: "Pasta",
    description: "Penne tossed with mushrooms, cream, garlic, herbs, and parmesan.",
    price: 11.49,
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=80",
    available: true,
    featured: false,
    createdAt
  },
  {
    id: "pasta-arrabbiata",
    name: "Arrabbiata Pasta",
    category: "Pasta",
    description: "Spicy tomato sauce, garlic, basil, chili flakes, and al dente penne.",
    price: 10.99,
    image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=900&q=80",
    available: true,
    featured: false,
    createdAt
  },
  {
    id: "pasta-cheesy-penne",
    name: "Cheesy Penne Pasta",
    category: "Pasta",
    description: "Baked penne with tomato cream sauce, mozzarella, and parmesan crust.",
    price: 11.99,
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=900&q=80",
    available: true,
    featured: true,
    createdAt
  },
  {
    id: "biryani-chicken",
    name: "Chicken Biryani",
    category: "Biryani",
    description: "Layered basmati rice, tender chicken, warming spices, and raita.",
    price: 9.99,
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=900&q=80",
    available: true,
    featured: true,
    createdAt
  },
  {
    id: "biryani-beef",
    name: "Beef Biryani",
    category: "Biryani",
    description: "Slow-cooked beef, fragrant rice, fried onions, mint, and masala.",
    price: 11.49,
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=900&q=80",
    available: true,
    featured: false,
    createdAt
  },
  {
    id: "biryani-foodie-special",
    name: "Special Foodie WE Biryani",
    category: "Biryani",
    description: "House-special masala, chicken, beef kabab bites, potatoes, and saffron rice.",
    price: 13.49,
    image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=900&q=80",
    available: true,
    featured: true,
    createdAt
  },
  {
    id: "biryani-sindhi",
    name: "Sindhi Biryani",
    category: "Biryani",
    description: "Bold Sindhi spices, potatoes, tomatoes, chilies, and aromatic rice.",
    price: 10.99,
    image: "https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?auto=format&fit=crop&w=900&q=80",
    available: true,
    featured: false,
    createdAt
  }
];

seedItems.forEach((item) => {
  if (!item.updatedAt) item.updatedAt = item.createdAt;
  if (!item.imageUrl) item.imageUrl = item.image;
});

function tableName() {
  if (!config.menuTableName) throw new Error("MENU_TABLE_NAME is required");
  return config.menuTableName;
}

function toMenuItem(item) {
  if (!item) return null;
  const { PK, SK, GSI1PK, GSI1SK, ...menuItem } = item;
  return menuItem;
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

function toDynamoItem(item) {
  return {
    ...item,
    PK: "MENU",
    SK: `ITEM#${item.id}`,
    GSI1PK: `CATEGORY#${item.category}`,
    GSI1SK: `ITEM#${item.id}`
  };
}

class MenuRepository {
  constructor() {
    this.seedPromise = null;
  }

  async ensureSeeded() {
    if (!this.seedPromise) {
      this.seedPromise = this.seedIfTableIsEmpty().catch((err) => {
        this.seedPromise = null;
        throw err;
      });
    }
    return this.seedPromise;
  }

  async seedIfTableIsEmpty() {
    const existing = await queryAll({
      TableName: tableName(),
      KeyConditionExpression: "PK = :pk",
      ExpressionAttributeValues: { ":pk": "MENU" },
      ProjectionExpression: "PK"
    });
    if (existing.length) return;

    await Promise.all(seedItems.map((item) => client.send(new PutCommand({
      TableName: tableName(),
      Item: toDynamoItem(item),
      ConditionExpression: "attribute_not_exists(PK)"
    })).catch((err) => {
      if (err.name !== "ConditionalCheckFailedException") throw err;
    })));
  }

  async findAll() {
    await this.ensureSeeded();
    const items = await queryAll({
      TableName: tableName(),
      KeyConditionExpression: "PK = :pk",
      ExpressionAttributeValues: { ":pk": "MENU" }
    });
    return items.map(toMenuItem);
  }

  async findById(id) {
    await this.ensureSeeded();
    const result = await client.send(new GetCommand({
      TableName: tableName(),
      Key: { PK: "MENU", SK: `ITEM#${id}` }
    }));
    return toMenuItem(result.Item);
  }

  async findByCategory(category) {
    await this.ensureSeeded();
    const items = await queryAll({
      TableName: tableName(),
      IndexName: "GSI1",
      KeyConditionExpression: "GSI1PK = :pk",
      ExpressionAttributeValues: { ":pk": `CATEGORY#${category}` }
    });
    return items.map(toMenuItem);
  }

  async create(data) {
    const item = toDynamoItem(data);
    await client.send(new PutCommand({
      TableName: tableName(),
      Item: item,
      ConditionExpression: "attribute_not_exists(PK) AND attribute_not_exists(SK)"
    }));
    return toMenuItem(item);
  }

  async update(id, updates) {
    const fields = Object.entries(updates).filter(([field, value]) =>
      value !== undefined && !["PK", "SK", "GSI1PK", "GSI1SK", "id"].includes(field)
    );
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

    if (updates.category !== undefined) {
      names["#gsi1pk"] = "GSI1PK";
      values[":gsi1pk"] = `CATEGORY#${updates.category}`;
      assignments.push("#gsi1pk = :gsi1pk");
    }

    try {
      const result = await client.send(new UpdateCommand({
        TableName: tableName(),
        Key: { PK: "MENU", SK: `ITEM#${id}` },
        UpdateExpression: `SET ${assignments.join(", ")}`,
        ConditionExpression: "attribute_exists(PK)",
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
        ReturnValues: "ALL_NEW"
      }));
      return toMenuItem(result.Attributes);
    } catch (err) {
      if (err.name === "ConditionalCheckFailedException") return null;
      throw err;
    }
  }

  async delete(id) {
    try {
      await client.send(new DeleteCommand({
        TableName: tableName(),
        Key: { PK: "MENU", SK: `ITEM#${id}` },
        ConditionExpression: "attribute_exists(PK)"
      }));
      return true;
    } catch (err) {
      if (err.name === "ConditionalCheckFailedException") return false;
      throw err;
    }
  }
}

module.exports = { MenuRepository };
