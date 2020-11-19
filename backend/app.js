const express = require("express");
const path = require("path");
const app = express();
const bp = require("body-parser");
var cors = require("cors");

const authRouter = require("./router/authRouter");
const classRouter = require("./router/classRouter");
const messageRouter = require("./router/messageRouter");
const MulterMiddleware = require("./middlewares/MulterMiddleware");
app.use(bp.json());
app.use(cors());
app.use("/images", express.static(path.join("backend/public/images")));
app.use("/avatar", express.static(path.join("backend/public/avatars")));
app.use("/api/auth", authRouter);
app.use("/api/class", classRouter);
app.use("/api/message", messageRouter);
app.use("/api/file", MulterMiddleware.single("file"));
module.exports = app;
