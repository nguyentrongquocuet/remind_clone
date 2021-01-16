const AnalysisDb = require("../Database/AnalysisDb");
const DB = require("../Database/db");
const { ROLE } = require("../Utils/ROLE");
class SocketIO {
  init(server, app) {
    this.socketId = new Map();
    this.io = require("socket.io")(server);
    this.io.set("match origin protocol", true);
    this.io.set("origins", "http://localhost:3000");
    app.set("io", this.io);
    this.io.use(async (socket, next) => {
      await AnalysisDb.db.query(
        "UPDATE analysis SET amount = amount+1 WHERE id=2"
      );
      next();
    });
    this.io.on("connection", async (socket) => {
      console.log("CONNECT TO", socket.id);
      socket.on("auth", async (userId) => {
        console.log("socket auth", new Date(), userId);
        if (userId) {
          const [
            classData,
          ] = await DB.db.query(
            "SELECT * from user_info ui inner join class_member cm on cm.userId=? and ui.id=cm.userId inner join message_room mr on cm.classId = mr.classId",
            [userId]
          );
          classData.map((c) => {
            socket.join(`class-${c.roomId}-all`);
            socket.join(`class-${c.roomId}-${ROLE[c.role]}`);
          });
          const [privateRoom] = await DB.db.query(
            "SELECT * FROM message_room WHERE privateMember REGEXP ?",
            `((^${userId},)|,${userId}$)`
          );
          privateRoom.map((r) => socket.join(`class-${r.roomId}-all`));
          this.socketId.set(userId, socket.id);
          console.log("oke", userId);
          socket.emit("auth", { socketId: socket.id });
        } else {
          socket.auth = false;
          console.log("not oke");
        }
      });
    });
  }
}
module.exports = new SocketIO();
