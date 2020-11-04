const app = require("./backend/app");
const port = process.env.SERVER_PORT || 5000;

const sql = require("./backend/Database/db");
require("dotenv").config();
const db = sql.init();
if (db instanceof Error) {
  throw db;
}
app.set("port", port);
app.set("db", db);
const sever = require("http").createServer(app);
const io = require("socket.io")(sever);
io.set("match origin protocol", true);
io.set("origins", "http://localhost:3000");
io.on("connection", (socket) => {
  socket.emit("hello", "HELLLO");
});
app.set("io", io);
sever.listen(port, () => {
  console.log("Listening at port", port);
});
