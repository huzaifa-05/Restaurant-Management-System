const express = require("express");
const cors = require("cors");
const { config } = require("./src/config");
const orderRoutes = require("./src/routes/orderRoutes");
const { errorHandler } = require("./src/middleware/errorHandler");
const { requestLogger } = require("./src/middleware/requestLogger");
const { logger } = require("./src/utils/logger");

const app = express();

app.use(cors({ origin: config.frontendOrigin, credentials: true }));
app.use(express.json());
app.use(requestLogger);

app.get("/health", (_req, res) => {
  res.json({ status: "healthy", service: "order-service" });
});

app.use("/api/orders", orderRoutes);
app.use(errorHandler);

app.listen(config.port, () => {
  logger.info("service startup", { service: "order-service", port: config.port });
});
