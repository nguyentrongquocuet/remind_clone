const Router = require("express").Router();
const controller = require("../controller/messageController");
const multerMiddleWare = require("../middlewares/MulterMiddleware");
const roleCheck = require("../middlewares/RoleCheckMiddleWare");
Router.post("/", multerMiddleWare.single("file"), controller.sendMessage);
Router.post(
  "/announcement",
  roleCheck("teacher"),
  multerMiddleWare.single("file"),
  controller.sendAnnouncement
);
Router.post("/initialPrivateRoom", controller.initialPrivateRoom);
Router.put(
  "/announcement",
  roleCheck("teacher"),
  multerMiddleWare.single("file"),
  controller.editSchedule
);

Router.delete("/schedule", roleCheck("teacher"), controller.deleteSchedule);
Router.get("/", controller.getMessages);
Router.get("/schedule", roleCheck("teacher"), controller.getScheduleDetails);
Router.get("/files", controller.getFiles);
Router.get("/fileDetails", controller.getFileDetails);
Router.get(
  "/getPrivateConversationData",
  controller.getPrivateConversationData
);
Router.get("/schedules", roleCheck("teacher"), controller.getSchedules);

module.exports = Router;
