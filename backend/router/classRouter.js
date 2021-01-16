const Router = require("express").Router();
const controller = require("../controller/classController");
const multerMiddleware = require("../middlewares/MulterMiddleware");
const roleCheck = require("../middlewares/RoleCheckMiddleWare");

Router.get("/find", controller.findClass);
Router.get("/member", controller.getMembers);
Router.get("/", controller.getClass);
Router.get("/child", roleCheck("parent"), controller.getChildrenClasses);
Router.get("/classSettings", controller.getClassSettings);
Router.post("/join", roleCheck("student", "parent"), controller.joinClass);
Router.post(
  "/new",
  roleCheck("teacher"),
  multerMiddleware.single("avatar"),
  controller.createClass
);
Router.put(
  "/modifyClass",
  multerMiddleware.single("avatar"),
  controller.modifyClass
);
Router.post("/invite", controller.sendInvitation);
module.exports = Router;
