const router = require("express").Router();
const controller = require("../controllers/orderController");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const { requireInternalService } = require("../middleware/serviceAuth");

router.post("/", requireAuth, controller.createOrder);
router.get("/", requireAdmin, controller.listOrders);
router.get("/user/:userId", requireAuth, controller.getUserOrders);
router.get("/:id", requireAuth, controller.getOrder);
router.patch("/:id/status", requireAdmin, controller.updateStatus);
router.patch("/:id/payment-status", requireAuth, controller.updatePaymentStatus);
router.post("/:id/cancel", requireAuth, controller.cancelOrder);
router.get("/internal/:id", requireInternalService, controller.getInternalOrder);
router.patch("/internal/:id/payment-status", requireInternalService, controller.updateInternalPaymentStatus);

module.exports = router;
