const Router = require("express").Router();
const controller = require("../controller/classController");
const authMiddleware = require("../middlewares/AuthMiddleware");
const multerMiddleware = require("../middlewares/MulterMiddleware");
Router.get("/find", authMiddleware, controller.findClass);
Router.get("/member", authMiddleware, controller.getMembers);
Router.post("/join", authMiddleware, controller.joinClass);
Router.post(
  "/new",
  authMiddleware,
  multerMiddleware.single("avatar"),
  controller.createClass
);
Router.get("/", authMiddleware, controller.getClass);
module.exports = Router;
