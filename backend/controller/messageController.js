const socketIO = require("../configs/socketIO");
const schedule = require("node-schedule");

const Db = require("../Database/db");
exports.sendMessage = async (req, res) => {
  const userId = req.decodedToken.userId;
  const roomId = req.query.roomId;
  const file = req.file;

  const { content } = req.body;
  const db = Db.db;
  let filePath = null;
  if (file) {
    filePath =
      req.protocol + "://" + req.get("host") + "/images/" + req.file.filename;
  }
  try {
    const [
      send,
    ] = await db.query(
      `INSERT INTO messages(senderId, roomId, content,file) VALUES(?,?,?, ?)`,
      [userId, roomId, content, filePath]
    );
    const [getBack] = await db.query(`SELECT * FROM messages WHERE id = ?`, [
      send.insertId,
    ]);
    console.log(
      "from",
      socketIO.socketId.entries(),
      "to",
      socketIO.socketId.get(userId)
    );
    socketIO.io.sockets.connected[socketIO.socketId.get(userId)]
      .to(`class-${roomId}`)
      .emit("messages", { ...getBack[0] });
    return res.status(200).json(getBack[0]);
  } catch (error) {
    throw error;
  }
};
exports.sendAnnouncement = async (req, res) => {
  const userId = req.decodedToken.userId;
  const { roomIds, content, scheduleTime } = req.body;
  const userSocket =
    socketIO.io.sockets.connected[socketIO.socketId.get(userId)];
  const rooms = roomIds.split(",").map((c) => c);
  const file = req.file;
  const db = Db.db;
  let filePath = null;
  if (file) {
    filePath =
      req.protocol + "://" + req.get("host") + "/images/" + req.file.filename;
  }
  let values = rooms.map((room) => {
    return [userId, room, content, filePath, 1];
  });
  let query = `INSERT INTO messages(senderId, roomId, content,file, type) VALUES ?`;
  if (
    scheduleTime &&
    new Date(Date.parse(scheduleTime)) - new Date(Date.now()) > 0
  ) {
    console.log("set schedule", scheduleTime);
    const scheduleTimeInMysql = new Date(scheduleTime)
      .toISOString()
      .replace("T", " ");
    const query2 = `INSERT INTO announcement_schedule(senderId, roomId, content,file, type,time) VALUES ?`;
    const values2 = rooms.map((room) => {
      return [userId, room, content, filePath, 1, scheduleTimeInMysql];
    });

    const [storeSchedule] = await db.query(query2, [values2]); //when server down, fetch schedule and excute
    schedule.scheduleJob(scheduleTime, async (fireDate) => {
      console.log(fireDate);
      //sendAnnouncement
      const [send] = await db.query(query, [values]);
      const [
        getBack,
      ] = await db.query(`SELECT * FROM messages WHERE id BETWEEN ? AND ?`, [
        send.insertId,
        send.insertId + values.length,
      ]);
      if (userSocket) {
        for (let index in getBack) {
          userSocket.emit("messages", { ...getBack[index] });
          userSocket
            .to(`class-${rooms[index]}`)
            .emit("messages", { ...getBack[index] });
        }
      }
    });
    return res.status(200).json({
      rooms,
      userId,
      filePath,
    });
  } else {
    //send immediately
    console.log("expried");
    const [send] = await db.query(query, [values]);
    const [
      getBack,
    ] = await db.query(`SELECT * FROM messages WHERE id BETWEEN ? AND ?`, [
      send.insertId,
      send.insertId + values.length,
    ]);

    if (userSocket) {
      for (let index in getBack) {
        userSocket.emit("messages", { ...getBack[index] });
        userSocket
          .to(`class-${rooms[index]}`)
          .emit("messages", { ...getBack[index] });
      }
    }

    return res.status(200).json({
      rooms,
      userId,
      filePath,
    });
  }
  //query (senderId, roomId, content, file, type)

  const [send] = await db.query(query, [values]);

  // console.log(values);
  // try {
  //   console.log({
  //     rooms,
  //     userId,
  //     filePath,
  //     content,
  //   });
  //   const [
  //     getBack,
  //   ] = await db.query(`SELECT * FROM messages WHERE id BETWEEN ? AND ?`, [
  //     send.insertId,
  //     send.insertId + values.length,
  //   ]);
  //   if (userSocket) {
  //     for (let index in getBack) {
  //       socketIO.io.sockets.connected[
  //         socketIO.socketId.get(userId)
  //       ].emit("messages", { ...getBack[index] });
  //       socketIO.io.sockets.connected[socketIO.socketId.get(userId)]
  //         .to(`class-${rooms[index]}`)
  //         .emit("messages", { ...getBack[index] });
  //     }
  //   }

  //   res.status(200).json({
  //     rooms,
  //     userId,
  //     filePath,
  //   });
  // } catch (error) {
  //   throw error;
  // }
};

exports.getMessages = async (req, res) => {
  // const userId = req.decodedToken.userId;
  const roomId = req.query.roomId;
  const db = Db.db;
  const [
    result,
  ] = await db.query(
    `SELECT * FROM messages WHERE roomId= ? ORDER BY createAt`,
    [roomId]
  );
  res.status(200).json(result);
};
