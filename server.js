const app = require("./backend/app");
const socketIO = require("./backend/configs/socketIO");
const port = process.env.SERVER_PORT || 5000;

const DB = require("./backend/Database/db");
require("dotenv").config();
try {
  DB.init();
  app.set("port", port);
  const server = require("http").createServer(app);
  socketIO.init(server, app);
  server.listen(port, () => {
    console.log("Listening at port", port);
  });
} catch (error) {
  throw error;
}
