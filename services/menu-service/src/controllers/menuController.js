const { MenuService } = require("../services/menuService");
const { success } = require("../utils/apiResponse");

const service = new MenuService();

async function getMenu(_req, res, next) {
  try {
    success(res, await service.getMenu());
  } catch (err) {
    next(err);
  }
}

async function getItems(_req, res, next) {
  try {
    success(res, await service.getItems());
  } catch (err) {
    next(err);
  }
}

async function getItem(req, res, next) {
  try {
    success(res, await service.getItem(req.params.id));
  } catch (err) {
    next(err);
  }
}

async function getCategory(req, res, next) {
  try {
    success(res, await service.getCategory(req.params.category));
  } catch (err) {
    next(err);
  }
}

async function createItem(req, res, next) {
  try {
    success(res, await service.createItem(req.body), 201);
  } catch (err) {
    next(err);
  }
}

async function updateItem(req, res, next) {
  try {
    success(res, await service.updateItem(req.params.id, req.body));
  } catch (err) {
    next(err);
  }
}

async function deleteItem(req, res, next) {
  try {
    success(res, await service.deleteItem(req.params.id));
  } catch (err) {
    next(err);
  }
}

async function updateAvailability(req, res, next) {
  try {
    success(res, await service.updateAvailability(req.params.id, req.body.available));
  } catch (err) {
    next(err);
  }
}

module.exports = { getMenu, getItems, getItem, getCategory, createItem, updateItem, deleteItem, updateAvailability };
