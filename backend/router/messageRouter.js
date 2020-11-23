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
Router.put(
  "/announcement",
  authMiddleWare,
  multerMiddleWare.single("file"),
  controller.editSchedule
);
Router.get("/schedule", authMiddleWare, controller.getScheduleDetails);
Router.get("/", authMiddleWare, controller.getMessages);
module.exports = Router;
