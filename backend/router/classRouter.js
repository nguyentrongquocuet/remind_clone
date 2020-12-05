const Router = require("express").Router();
const controller = require("../controller/classController");
const authMiddleware = require("../middlewares/AuthMiddleware");
const multerMiddleware = require("../middlewares/MulterMiddleware");
const roleCheck = require("../middlewares/RoleCheckMiddleWare");
Router.get("/find", authMiddleware, controller.findClass);
Router.get("/member", authMiddleware, controller.getMembers);
Router.get("/", authMiddleware, controller.getClass);
Router.get(
  "/child",
  authMiddleware,
  roleCheck("parent", controller),
  controller.getChildrenClasses
);
Router.post(
  "/join",
  authMiddleware,
  roleCheck("student", "parent"),
  controller.joinClass
);
Router.post(
  "/new",
  authMiddleware,
  roleCheck("teacher"),
  multerMiddleware.single("avatar"),
  controller.createClass
);
Router.post("/invite", authMiddleware, controller.sendInvitation);
module.exports = Router;
