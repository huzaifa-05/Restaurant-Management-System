const express = require("express");
const cors = require("cors");
const { config } = require("./src/config");
const userRoutes = require("./src/routes/userRoutes");
const { errorHandler } = require("./src/middleware/errorHandler");
const { requestLogger } = require("./src/middleware/requestLogger");
const { logger } = require("./src/utils/logger");

const app = express();

app.use(cors({ origin: config.frontendOrigin, credentials: true }));
app.use(express.json());
app.use(requestLogger);

app.get("/health", (_req, res) => {
  res.json({ status: "healthy", service: "user-service" });
});

app.use("/api/users", userRoutes);
app.use(errorHandler);

app.listen(config.port, () => {
  logger.info("service startup", { service: "user-service", port: config.port });
});
