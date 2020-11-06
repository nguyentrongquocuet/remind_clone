exports.sendMessage = (req, res) => {
  const userId = req.decodedToken.userId;
  const roomId = req.query.roomId;
  const { content } = req.body;
  const db = req.app.get("db");
  db.query(
    `INSERT INTO messages(senderId, roomId, content) VALUES(?,?,?)`,
    [userId, roomId, content],
    (error, result) => {
      db.query(
        `SELECT * FROM messages WHERE id = ?`,
        [result.insertId],
        (error, result) => {
          res.status(200).json(result[0]);
        }
      );
    }
  );
};

exports.getMessages = (req, res) => {
  // const userId = req.decodedToken.userId;
  const roomId = req.query.roomId;
  const db = req.app.get("db");
  setTimeout(
    () =>
      db.query(
        `SELECT * FROM messages WHERE roomId= ? ORDER BY createAt`,
        [roomId],
        (error, result) => {
          res.status(200).json(result);
        }
      ),
    3000
  );
};
