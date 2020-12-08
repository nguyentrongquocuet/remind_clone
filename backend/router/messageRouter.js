const Router = require("express").Router();
const controller = require("../controller/messageController");
const authMiddleWare = require("../middlewares/AuthMiddleware");
const multerMiddleWare = require("../middlewares/MulterMiddleware");
const roleCheck = require("../middlewares/RoleCheckMiddleWare");
Router.post(
  "/",
  authMiddleWare,
  multerMiddleWare.single("file"),
  controller.sendMessage
);
Router.post(
  "/announcement",
  authMiddleWare,
  roleCheck("teacher"),
  multerMiddleWare.single("file"),
  controller.sendAnnouncement
);
Router.post(
  "/initialPrivateRoom",
  authMiddleWare,
  controller.initialPrivateRoom
);
Router.put(
  "/announcement",
  authMiddleWare,
  roleCheck("teacher"),
  multerMiddleWare.single("file"),
  controller.editSchedule
);
Router.delete(
  "/schedule",
  authMiddleWare,
  roleCheck("teacher"),
  controller.deleteSchedule
);
Router.get("/", authMiddleWare, controller.getMessages);
Router.get(
  "/schedule",
  authMiddleWare,
  roleCheck("teacher"),
  controller.getScheduleDetails
);
Router.get("/files", authMiddleWare, controller.getFiles);
Router.get("/fileDetails", authMiddleWare, controller.getFileDetails);
Router.get(
  "/getPrivateConversationData",
  authMiddleWare,
  controller.getPrivateConversationData
);
Router.get(
  "/schedules",
  authMiddleWare,
  roleCheck("teacher"),
  controller.getSchedules
);
module.exports = Router;
