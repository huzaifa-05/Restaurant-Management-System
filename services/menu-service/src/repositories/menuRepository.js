const createdAt = new Date().toISOString();

const items = [
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

items.forEach((item) => {
  if (!item.updatedAt) item.updatedAt = item.createdAt;
  if (!item.imageUrl) item.imageUrl = item.image;
});

class MenuRepository {
  async findAll() {
    return [...items];
  }

  async findById(id) {
    return items.find((item) => item.id === id) || null;
  }

  async findByCategory(category) {
    return items.filter((item) => item.category.toLowerCase() === category.toLowerCase());
  }

  async create(data) {
    items.push(data);
    return data;
  }

  async update(id, updates) {
    const item = await this.findById(id);
    if (!item) return null;
    Object.assign(item, updates);
    return item;
  }

  async delete(id) {
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return false;
    items.splice(index, 1);
    return true;
  }
}

module.exports = { MenuRepository };
