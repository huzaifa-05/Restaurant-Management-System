const { randomUUID } = require("crypto");
const { CATEGORIES } = require("../config");
const { MenuRepository } = require("../repositories/menuRepository");
const { AppError } = require("../utils/AppError");
const { logger } = require("../utils/logger");

const repository = new MenuRepository();

function validateItem(payload, partial = false) {
  const required = ["name", "category", "description", "price"];
  if (!partial) {
    required.forEach((field) => {
      if (!payload[field]) throw new AppError(`${field} is required`, 400);
    });
    if (!payload.image && !payload.imageUrl) {
      throw new AppError("image is required", 400);
    }
  }
  if (payload.category && !CATEGORIES.includes(payload.category)) {
    throw new AppError("Invalid menu category", 400);
  }
  if (payload.price !== undefined && Number(payload.price) <= 0) {
    throw new AppError("Price must be greater than 0", 400);
  }
}

class MenuService {
  async getMenu() {
    return { restaurant: "Foodie WE", categories: CATEGORIES, items: await repository.findAll() };
  }

  async getItems() {
    return repository.findAll();
  }

  async getItem(id) {
    const item = await repository.findById(id);
    if (!item) throw new AppError("Menu item not found", 404);
    return item;
  }

  async getCategory(category) {
    if (!CATEGORIES.some((value) => value.toLowerCase() === category.toLowerCase())) {
      throw new AppError("Menu category not found", 404);
    }
    return repository.findByCategory(category);
  }

  async createItem(payload) {
    validateItem(payload);
    const image = payload.image || payload.imageUrl;
    const now = new Date().toISOString();
    const item = {
      id: payload.id || randomUUID(),
      name: payload.name,
      category: payload.category,
      description: payload.description,
      price: Number(payload.price),
      image,
      imageUrl: payload.imageUrl || image,
      available: payload.available !== false,
      featured: Boolean(payload.featured),
      createdAt: now,
      updatedAt: now
    };
    const created = await repository.create(item);
    logger.info("menu item created", { itemId: created.id });
    return created;
  }

  async updateItem(id, payload) {
    validateItem(payload, true);
    const updates = { ...payload };
    if (updates.price !== undefined) updates.price = Number(updates.price);
    if (updates.image || updates.imageUrl) {
      updates.image = updates.image || updates.imageUrl;
      updates.imageUrl = updates.imageUrl || updates.image;
    }
    updates.updatedAt = new Date().toISOString();
    const item = await repository.update(id, updates);
    if (!item) throw new AppError("Menu item not found", 404);
    logger.info("menu item updated", { itemId: id });
    return item;
  }

  async deleteItem(id) {
    const deleted = await repository.delete(id);
    if (!deleted) throw new AppError("Menu item not found", 404);
    logger.info("menu item deleted", { itemId: id });
    return { id };
  }

  async updateAvailability(id, available) {
    if (typeof available !== "boolean") throw new AppError("available must be a boolean", 400);
    const item = await repository.update(id, { available, updatedAt: new Date().toISOString() });
    if (!item) throw new AppError("Menu item not found", 404);
    logger.info("menu item availability updated", { itemId: id, available });
    return item;
  }
}

module.exports = { MenuService };
