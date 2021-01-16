const express = require("express");
const path = require("path");
const app = express();
const bp = require("body-parser");
var cors = require("cors");

const authRouter = require("./router/authRouter");
const classRouter = require("./router/classRouter");
const messageRouter = require("./router/messageRouter");
const adminRouter = require("./router/adminRouter");
const configRouter = require("./router/configRouter");
const adminMiddleware = require("./middlewares/AdminMiddleware");
const AnalyzeMiddleware = require("./middlewares/AnalyzeMiddleware");
const authMiddleware = require("./middlewares/AuthMiddleware");
const SystemError = require("./models/Error");
const ErrorHandler = require("./middlewares/ErrorHandler");
// const googleOath = require("./Utils/googleOath");
const externalApiRouter = require("./router/externalApiRouter");
const Db = require("./Database/db");

app.use((req, res, next) => {
  req.method !== "OPTIONS" && console.log(req.path);
  next();
}, AnalyzeMiddleware.request);
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
// app.use("/testdrive");
app.use("/api/external", externalApiRouter);
app.use("/api/setting", configRouter);
app.use("/api/admin", adminMiddleware, adminRouter);
app.use("/api/auth", authRouter);
app.use("/api/class", authMiddleware, classRouter);
app.use("/api/message", authMiddleware, messageRouter);
// app.use("/api/file", (req, res, next) => {
//   next(new SystemError(404, "FILE NOT FOUND"));
// });

app.use(ErrorHandler);
module.exports = app;
