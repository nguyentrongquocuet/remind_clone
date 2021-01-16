const Router = require("express").Router();
const adminController = require("../controller/adminController");
const validator = require("../middlewares/ValidatorMiddleware");
const multer = require("../middlewares/MulterMiddleware");

Router.get("/userAmount", adminController.getUserAmount);
Router.get("/classAmount", adminController.getClassAmount);
Router.get("/requestAmount", adminController.getRequestAmount);
Router.get("/visitorAmount", adminController.getVisitorAmount);
Router.get("/users", adminController.getUsers);
Router.get("/user", adminController.getUserById);
Router.get("/usersClasses", adminController.getUsersClasses);
Router.get("/usersRelationships", adminController.getUsersRelationships);
Router.get("/classes", adminController.getClasses);
Router.get("/classById", adminController.getClassById);
Router.get("/fullClassInfo", adminController.getFullClassInfo);
Router.get("/classMember", adminController.getClassMember);
Router.post(
  "/newUser",
  validator.signup,
  multer.single("avatar"),
  adminController.addPeople
);
Router.post("/newClass", multer.single("avatar"), adminController.createClass);
Router.put(
  "/modifyUser",
  validator.signup,
  multer.single("avatar"),
  adminController.editUserInfo
);
Router.put(
  "/modifyClass",
  multer.single("avatar"),
  adminController.modifyClass
);
Router.delete("/removeClassMember", adminController.removeUserFromClass);
Router.delete("/removeUser", adminController.revokeUser);
Router.delete("/removeRelationship", adminController.removeRelationship);
Router.delete("/removeClass", adminController.removeClass);
module.exports = Router;
