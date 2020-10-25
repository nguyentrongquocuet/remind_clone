const Router = require("express").Router();
const controller = require("../controller/authController");
const validator = require("../middlewares/ValidatorMiddleware");
Router.post("/login", controller.login);
Router.post("/signup", validator.signup, controller.signup);
module.exports = Router;
