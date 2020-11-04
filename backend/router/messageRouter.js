const Router = require("express").Router();
const controller = require("../controller/messageController");
const authMiddleWare = require("../middlewares/AuthMiddleware");
Router.post("/", authMiddleWare, controller.sendMessage);
Router.get("/", authMiddleWare, controller.getMessages);
module.exports = Router;
