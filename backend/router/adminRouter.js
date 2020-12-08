const Router = require("express").Router();
const adminController = require("../controller/adminController");
Router.get("/userAmount", adminController.getUserAmount);
Router.get("/classAmount", adminController.getClassAmount);
module.exports = Router;
