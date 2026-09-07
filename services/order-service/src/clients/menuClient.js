const { config } = require("../config");
const { AppError } = require("../utils/AppError");
const { logger } = require("../utils/logger");

class MenuClient {
  constructor(baseUrl = config.menuServiceUrl) {
    this.baseUrl = baseUrl;
  }

  async getMenuItem(itemId) {
    const url = `${this.baseUrl}/api/menu/items/${itemId}`;
    logger.info("menu service request", { itemId, url });

    const response = await fetch(url);
    if (response.status === 404) {
      throw new AppError(`Menu item ${itemId} was not found`, 404);
    }
    if (!response.ok) {
      throw new AppError("Menu service unavailable", 502);
    }

    const body = await response.json();
    if (!body.success || !body.data) {
      throw new AppError(`Menu item ${itemId} was not found`, 404);
    }

    if (!body.data.available) {
      throw new AppError(`Menu item ${itemId} is unavailable`, 409);
    }

    return body.data;
  }
}

module.exports = { MenuClient };
