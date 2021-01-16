const Router = require("express").Router();
const controller = require("../controller/authController");
const authMiddleware = require("../middlewares/AuthMiddleware");
const MulterMiddleware = require("../middlewares/MulterMiddleware");
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
Router.post(
  "/changePasswordWithLogin",
  authMiddleware,
  validator.newpass,
  controller.changePassWordWithLogin
);
Router.post(
  "/changeInfo",
  authMiddleware,
  MulterMiddleware.single("avatar"),
  validator.editInfo,
  controller.changeUserInfo
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
Router.get("/newToken", controller.newToken);
Router.get("/myInfo", authMiddleware, controller.getFullMyInfo);
Router.put("/role", authMiddleware, controller.setRole);
Router.delete("/relationship", authMiddleware, controller.removeRelationship);
module.exports = Router;
