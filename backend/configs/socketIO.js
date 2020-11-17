class SocketIO {
  init(server, app) {
    this.socketId = new Map();
    this.io = require("socket.io")(server);
    this.io.set("match origin protocol", true);
    this.io.set("origins", "http://localhost:3000");
    app.set("io", this.io);
    this.io.on("connection", (socket) => {
      socket.on("auth", (userId) => {
        console.log(userId);
        if (userId) {
          socket.auth = true;
          this.socketId.set(userId, socket.id);
          console.log("oke");
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
