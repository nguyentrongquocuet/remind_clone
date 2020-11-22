const socketIO = require("../configs/socketIO");
const Db = require("../Database/db");

exports.createClass = async (req, res) => {
  const { className } = req.body;
  const { userId } = req.decodedToken;
  const db = Db.db;
  const socket = socketIO.io.sockets.connected[socketIO.socketId.get(userId)];
  try {
    const [
      addClass,
    ] = await db.query(`INSERT INTO class(name, owner) VALUES (?,?)`, [
      className,
      userId,
    ]);
    const [
      addToClassMember,
    ] = await db.query(
      `INSERT INTO class_member(classId, userId) VALUES(?,?)`,
      [addClass.insertId, userId]
    );
    await db.query(`INSERT INTO message_room(classId) VALUES (?)`, [
      addClass.insertId,
    ]);
    const [
      data,
    ] = await db.query(
      `SELECT * FROM class c INNER JOIN message_room mr ON  c.classId=? AND c.classId=mr.classId`,
      [addClass.insertId]
    );
    if (socket) {
      const room = `class-${data[0].roomId}`;
      socket.join(room);
    }

    res.send(data[0]);
  } catch (error) {
    res.status(404).json("Something went wrong!");
    throw error;
  }
};
exports.getClass = async (req, res) => {
  const userId = req.decodedToken.userId;
  const db = Db.db;
  const socket = socketIO.io.sockets.connected[socketIO.socketId.get(userId)];
  try {
    const [classes] = await db.query(
      `SELECT * 
      FROM class c 
      INNER JOIN class_member cm ON c.classId = cm.classId AND cm.userId=? 
      INNER JOIN  message_room mr ON c.classId=mr.classId`,
      [userId]
    );
    const finalClasses = classes.reduce((prev, cur) => {
      prev[cur.classId] = cur;
      return prev;
    }, {});
    if (socket) {
      for (const classs of classes) {
        const room = `class-${classs.roomId}`;
        socket.join(room);
      }
    }

    res.status(200).json(finalClasses);
  } catch (error) {
    throw error;
  }
};
// SELECT * FROM class_member cm INNER JOIN class c ON  cm.userId =?
//     AND cm.classId=c.classId
// SELECT * FROM class c INNER JOIN class_member cm ON c.classId = cm.classId AND cm.userId=1 INNER JOIN  message_room mr ON c.classId=mr.classId
exports.findClass = async (req, res) => {
  let { query, notJoined } = req.query;
  const userId = req.decodedToken.userId;
  const db = Db.db;
  let nameMode = true;
  if (query[0] === "@") {
    query = query.split("@").filter((e) => e)[0];
    nameMode = false;
    query = "%" + query + "%";
  } else {
    query = query
      .split(" ")
      .reduce((prev, cur) => {
        prev = prev + "+" + cur + " ";
        return prev;
      }, "")
      .match(/^(\+.+)\s$/)[1];
  }
  try {
    const [classes] = await db.query(
      `SELECT * FROM class WHERE ${
        nameMode ? "MATCH(name) AGAINST(?)" : "classId LIKE ?"
      } ${
        notJoined === "false"
          ? "AND classId IN (SELECT classId from class_member WHERE userId = ?)"
          : "AND classId NOT IN (SELECT classId from class_member WHERE userId = ?)"
      }`,
      [query, userId]
    );

    return res.status(200).json(classes);
  } catch (error) {
    throw error;
  }

  // if (query) return res.status(200).json(query);
  // return res.status(401).json("dad");
};

exports.getMembers = async (req, res) => {
  const db = Db.db;
  let classId = req.query.classId;
  if (isNaN(classId)) classId = -1;
  try {
    const [members] = await db.query(
      `SELECT * FROM class_member cm 
      INNER JOIN user_info ui ON cm.userId = ui.id 
      WHERE classId=?`,
      [classId]
    );
    const finalMembers = members
      .map((m) => {
        return { ...m, name: `${m.firstName} ${m.lastName}` };
      })
      .reduce((prev, cur) => {
        prev[cur.id] = cur;
        return prev;
      }, {});
    setTimeout(() => {
      res.status(200).json(finalMembers);
    }, 500);
  } catch (error) {
    throw error;
  }
};

exports.dummy = (req, res) => {
  const db = Db.db;
  const a = db.query(`SELECT * FROM class_member`);
  res.send(a);
};

exports.joinClass = async (req, res) => {
  const userId = req.decodedToken.userId;
  const classId = req.body.classId;
  const db = Db.db;
  const socket = socketIO.io.sockets.connected[socketIO.socketId.get(userId)];
  if (classId) {
    try {
      await db.query(`INSERT INTO class_member (classId, userId) VALUES(?,?)`, [
        classId,
        userId,
      ]);
      const [getDataBack] = await db.query(
        `SELECT * 
        FROM class c 
        INNER JOIN (SELECT * FROM class_member WHERE classId = ? AND userId = ?) cm ON c.classId = cm.classId 
        INNER JOIN message_room mr ON c.classId=mr.classId`,
        [classId, userId]
      );
      if (socket) {
        const room = `class-${getDataBack[0].roomId}`;
        socket.join(room);
      }

      return res.status(200).json(getDataBack[0]);
    } catch (error) {
      throw error;
    }
  } else return res.status(500).json("invalid classId");
};
