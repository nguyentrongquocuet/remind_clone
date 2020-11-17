const Router = require("express").Router();
const controller = require("../controller/authController");
const authMiddleware = require("../middlewares/AuthMiddleware");
const validator = require("../middlewares/ValidatorMiddleware");
Router.post("/login", controller.login);
Router.post("/signup", validator.signup, controller.signup);
Router.post("/auth", authMiddleware, controller.authenticate);
Router.put("/role", authMiddleware, controller.setRole);
module.exports = Router;
