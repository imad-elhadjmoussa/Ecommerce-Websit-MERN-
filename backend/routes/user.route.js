const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.post("/admin-login", userController.adminLogin);
router.post("/signup", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/check-auth", userController.isAuthenticated);

module.exports = router;
