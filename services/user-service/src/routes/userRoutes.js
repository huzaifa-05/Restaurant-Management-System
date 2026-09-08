const router = require("express").Router();
const controller = require("../controllers/userController");
const { mockAuth } = require("../middleware/mockAuth");

router.get("/auth-config", controller.getAuthConfig);
router.get("/me", mockAuth, controller.getMe);
router.put("/me", mockAuth, controller.updateMe);
router.get("/:id", mockAuth, controller.getUser);

module.exports = router;
