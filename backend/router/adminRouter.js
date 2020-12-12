const Router = require("express").Router();
const adminController = require("../controller/adminController");
Router.get("/userAmount", adminController.getUserAmount);
Router.get("/classAmount", adminController.getClassAmount);
Router.get("/requestAmount", adminController.getRequestAmount);
Router.get("/visitorAmount", adminController.getVisitorAmount);
Router.get("/users", adminController.getUsers);
module.exports = Router;
