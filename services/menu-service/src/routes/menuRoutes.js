const router = require("express").Router();
const controller = require("../controllers/menuController");
const { requireAdmin } = require("../middleware/auth");

router.get("/", controller.getMenu);
router.get("/items", controller.getItems);
router.post("/items", requireAdmin, controller.createItem);
router.get("/items/:id", controller.getItem);
router.put("/items/:id", requireAdmin, controller.updateItem);
router.delete("/items/:id", requireAdmin, controller.deleteItem);
router.patch("/items/:id/availability", requireAdmin, controller.updateAvailability);
router.get("/category/:category", controller.getCategory);

module.exports = router;
