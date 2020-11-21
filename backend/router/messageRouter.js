const Router = require("express").Router();
const controller = require("../controller/messageController");
const authMiddleWare = require("../middlewares/AuthMiddleware");
const multerMiddleWare = require("../middlewares/MulterMiddleware");
Router.post(
  "/",
  authMiddleWare,
  multerMiddleWare.single("file"),
  controller.sendMessage
);
Router.post(
  "/announcement",
  authMiddleWare,
  multerMiddleWare.single("file"),
  controller.sendAnnouncement
);
Router.get("/", authMiddleWare, controller.getMessages);
module.exports = Router;
