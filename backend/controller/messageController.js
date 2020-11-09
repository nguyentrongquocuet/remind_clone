exports.sendMessage = async (req, res) => {
  const userId = req.decodedToken.userId;
  const roomId = req.query.roomId;
  const { content } = req.body;
  const db = req.app.get("db");
  try {
    const [
      send,
    ] = await db.query(
      `INSERT INTO messages(senderId, roomId, content) VALUES(?,?,?)`,
      [userId, roomId, content]
    );
    const [getBack] = await db.query(`SELECT * FROM messages WHERE id = ?`, [
      send.insertId,
    ]);
    return res.status(200).json(getBack[0]);
  } catch (error) {
    throw error;
  }
};

exports.getMessages = async (req, res) => {
  // const userId = req.decodedToken.userId;
  const roomId = req.query.roomId;
  const db = req.app.get("db");
  console.log("ROOMID", req.query);
  const [
    result,
  ] = await db.query(
    `SELECT * FROM messages WHERE roomId= ? ORDER BY createAt`,
    [roomId]
  );
  res.status(200).json(result);
};
