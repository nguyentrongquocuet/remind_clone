const express = require("express");
const path = require("path");
const app = express();
const bp = require("body-parser");
var cors = require("cors");

const authRouter = require("./router/authRouter");
const classRouter = require("./router/classRouter");
const messageRouter = require("./router/messageRouter");
const MulterMiddleware = require("./middlewares/MulterMiddleware");
const adminMiddleware = require("./middlewares/AdminMiddleware");
const adminRouter = require("./router/adminRouter");
const AnalyzeMiddleware = require("./middlewares/AnalyzeMiddleware");
app.use(bp.json());
app.use(cors());
app.use(
  "/images",
  AnalyzeMiddleware.file,
  express.static(path.join("backend/public/images"))
);
app.use(
  "/avatar",
  AnalyzeMiddleware.file,
  express.static(path.join("backend/public/avatars"))
);
app.use(AnalyzeMiddleware.request);
app.use("/api/admin", adminMiddleware, adminRouter);
app.use("/api/auth", authRouter);
app.use("/api/class", classRouter);
app.use("/api/message", messageRouter);
app.use("/api/file", MulterMiddleware.single("file"));
module.exports = app;
