const Router = require("express").Router();
const controller = require("../controller/classController");
const authMiddleware = require("../middlewares/AuthMiddleware");
Router.get("/find", authMiddleware, controller.findClass);
Router.get("/member", authMiddleware, controller.getMembers);
Router.get("/", authMiddleware, controller.getClass);
module.exports = Router;
