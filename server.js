const app = require("./backend/app");
const socketIO = require("./backend/configs/socketIO");
const OATH = require("./backend/Utils/googleOath");
const port = process.env.SERVER_PORT || 5000;

const DB = require("./backend/Database/db");
const Redis = require("./backend/configs/Redis");
const AnalysisDb = require("./backend/Database/AnalysisDb");
require("dotenv").config();
try {
  DB.init();
  app.set("port", port);
  const server = require("http").createServer(app);
  socketIO.init(server, app);
  OATH.init();
  Redis.init();
  AnalysisDb.init();
  server.listen(port, () => {
    console.log("Listening at port", port);
  });
} catch (error) {
  throw error;
}
