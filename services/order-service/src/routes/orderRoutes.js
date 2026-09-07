const router = require("express").Router();
const controller = require("../controllers/orderController");
const { requireAuth, requireAdmin } = require("../middleware/auth");

router.post("/", requireAuth, controller.createOrder);
router.get("/", requireAdmin, controller.listOrders);
router.get("/user/:userId", requireAuth, controller.getUserOrders);
router.get("/:id", requireAuth, controller.getOrder);
router.patch("/:id/status", requireAdmin, controller.updateStatus);
router.post("/:id/cancel", requireAuth, controller.cancelOrder);

module.exports = router;
