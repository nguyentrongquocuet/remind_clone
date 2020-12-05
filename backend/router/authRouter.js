const Router = require("express").Router();
const controller = require("../controller/authController");
const authMiddleware = require("../middlewares/AuthMiddleware");
const roleCheck = require("../middlewares/RoleCheckMiddleWare");
const validator = require("../middlewares/ValidatorMiddleware");
Router.post("/login", controller.login);
Router.post("/signup", validator.signup, controller.signupPrepare);
Router.post("/withGoogle", controller.googleAuth);
Router.post("/confirmEmail", controller.confirmEmail);
Router.post("/confirmPasswordCode", controller.confirmPasswordCode);
Router.post(
  "/changePasswordWithoutLogin",
  controller.changePasswordWithoutLogin
);
Router.post("/auth", authMiddleware, controller.authenticate);
Router.post("/resetPassword", controller.resetPassword);
Router.post(
  "/connectChild",
  authMiddleware,
  roleCheck("student"),
  controller.connectChild
);
Router.get(
  "/connectUrl",
  authMiddleware,
  roleCheck("parent"),
  controller.getConnectChildUrl
);
Router.get("/info", authMiddleware, controller.getUserInfo);
Router.put("/role", authMiddleware, controller.setRole);
module.exports = Router;
