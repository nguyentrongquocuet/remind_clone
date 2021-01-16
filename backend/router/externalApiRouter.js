const authMiddleware = require("../middlewares/AuthMiddleware");
const resourceController = require("../controller/resourceController");
const Router = require("express").Router();

Router.get("/filesFromDrive", authMiddleware, resourceController.getDriveFiles);
Router.get(
  "/coursesFromClassroom",
  authMiddleware,
  resourceController.getClassrooms
);
module.exports = Router;
