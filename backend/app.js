const app = require("express")();
const bp = require("body-parser");
var cors = require("cors");

const authRouter = require("./router/authRouter");
const classRouter = require("./router/classRouter");
const messageRouter = require("./router/messageRouter");
app.use(bp.json());
app.use(cors());

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Headers, Authorization"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PATCH, DELETE, OPTIONS, PUT"
//   );
//   next();
// });
// app.use((req, res, next) => {
//   console.log(req.path);
//   console.log(req.body);
//   console.log(req.statusCode);
//   next();
// });
app.use("/api/auth", authRouter);
app.use("/api/class", classRouter);
app.use("/api/message", messageRouter);
module.exports = app;
