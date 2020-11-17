const app = require("./backend/app");
const socketIO = require("./backend/configs/socketIO");
const port = process.env.SERVER_PORT || 5000;

const sql = require("./backend/Database/db");
require("dotenv").config();
const db = sql.init();
if (db instanceof Error) {
  throw db;
}
app.set("port", port);
app.set("db", db.promise());
const server = require("http").createServer(app);
socketIO.init(server, app);
server.listen(port, () => {
  console.log("Listening at port", port);
});
