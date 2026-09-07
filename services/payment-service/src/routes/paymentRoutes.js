const router = require("express").Router();
const controller = require("../controllers/paymentController");

router.post("/", controller.createPayment);
router.post("/webhook", controller.processWebhook);
router.get("/order/:orderId", controller.getOrderPayments);
router.get("/:id", controller.getPayment);
router.post("/:id/refund", controller.refundPayment);

module.exports = router;
