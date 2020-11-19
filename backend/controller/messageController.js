const socketIO = require("../configs/socketIO");
exports.sendMessage = async (req, res) => {
  const userId = req.decodedToken.userId;
  const roomId = req.query.roomId;
  const file = req.file;

  const { content } = req.body;
  const db = req.app.get("db");
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

exports.getMessages = async (req, res) => {
  // const userId = req.decodedToken.userId;
  const roomId = req.query.roomId;
  const db = req.app.get("db");
  const [
    result,
  ] = await db.query(
    `SELECT * FROM messages WHERE roomId= ? ORDER BY createAt`,
    [roomId]
  );
  res.status(200).json(result);
};
