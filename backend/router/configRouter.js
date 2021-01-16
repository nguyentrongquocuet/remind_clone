const Router = require("express").Router();
const appConfigController = require("../controller/appConfigController");
Router.get("/", appConfigController.getAllSettings);

module.exports = Router;
