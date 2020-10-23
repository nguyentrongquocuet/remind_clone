const Router = require("express").Router();
const controller = require("../controller/authController");
Router.post("/login", controller.login);
Router.post("/signup", controller.signup);
module.exports = Router;
