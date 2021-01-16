const socketIO = require("../configs/socketIO");
const Db = require("../Database/db");
const transporter = require("../Mailer/Mailer.js");
// const Redis = require("../configs/Redis");
const SystemError = require("../models/Error");

// const cacheClasses = async (classesData) => {
//   // if (classesData.classId) {
//   //   const cachedData = await Redis.getAsync(`class-${classesData.classId}`);
//   //   if (!cachedData) {
//   //     await Redis.setAsync(
//   //       `class-${classesData.classId}`,
//   //       JSON.stringify(classesData)
//   //     );
//   //     await Redis.setAsync(
//   //       `class-room-${classesData.roomId}`,
//   //       JSON.stringify(classesData)
//   //     );
//   //   }
//   // } else {
//   //   for (const classData of Object.values(classesData)) {
//   //     const cachedData = await Redis.getAsync(`class-${classData.classId}`);
//   //     if (!cachedData)
//   //       await Redis.setAsync(
//   //         `class-${classData.classId}`,
//   //         JSON.stringify(classData)
//   //       );
//   //     await Redis.setAsync(
//   //       `class-room-${classData.roomId}`,
//   //       JSON.stringify(classData)
//   //     );
//   //   }
//   // }
// };

// const cacheUsers = (membersData) => {
//   for (const member of Object.values(membersData)) {
//     if (member.id)
//       Redis.cache.get(`user-${member.id}`, (err, rep) => {
//         console.log(err, rep);
//         if (!err && !rep) {
//           Redis.cache.set(`user-${member.id}`, JSON.stringify(member));
//         }
//       });
//   }
// };

exports.createClass = async (req, res, next) => {
  const { className } = req.body;
  const { userId } = req.decodedToken;
  const db = Db.db;
  const socket = socketIO.io.sockets.connected[socketIO.socketId.get(userId)];
  if (!className || className.length <= 0)
    throw new SystemError(404, "Invalid class info");
  try {
    let filePath = null;
    if (req.file)
      filePath = filePath =
        req.protocol + "://" + req.get("host") + "/images/" + req.file.filename;
    const [
      addClass,
    ] = await db.query(`INSERT INTO class(name, owner,avatar) VALUES (?,?,?)`, [
      className,
      userId,
      filePath,
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

    res.send({ ...data[0], message: "You've created  new class" });
    // cacheClasses(data[0]);
  } catch (error) {
    next(error);
  }
};
exports.getClass = async (req, res, next) => {
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
    //cache to redis
    // cacheClasses(finalClasses);
  } catch (error) {
    next(error);
  }
};

exports.getChildrenClasses = async (req, res, next) => {
  const userId = req.decodedToken.userId;
  const db = Db.db;
  // const {childId} = req.query;
  try {
    const [childList] = await db.query(
      "SELECT * FROM relationship WHERE parentId = ?",
      userId
    );
    const child = childList.map((c) => c.childId);
    console.log(child);
    let finalClasses = [];
    if (child.length > 0) {
      const [
        classes,
      ] = await db.query(
        "SELECT * FROM class_member cm INNER JOIN class c ON cm.userId IN (?) AND c.classId = cm.classId",
        [child]
      );
      finalClasses = classes.reduce((prev, cur) => {
        prev[cur.classId] = cur;
        return prev;
      }, {});
    }
    // cacheClasses(finalClasses);
    console.log("HHHHH", finalClasses);
    res.status(200).json(finalClasses);
  } catch (error) {
    next(error);
  }
};
// SELECT * FROM class_member cm INNER JOIN class c ON  cm.userId =?
//     AND cm.classId=c.classId
// SELECT * FROM class c INNER JOIN class_member cm ON c.classId = cm.classId AND cm.userId=1 INNER JOIN  message_room mr ON c.classId=mr.classId
exports.findClass = async (req, res, next) => {
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
    next(error);
  }

  // if (query) return res.status(200).json(query);
  // return res.status(401).json("dad");
};

exports.getMembers = async (req, res, next) => {
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
    // cacheUsers(finalMembers);
  } catch (error) {
    next(error);
  }
};

exports.dummy = (req, res) => {
  const db = Db.db;
  const a = db.query(`SELECT * FROM class_member`);
  res.send(a);
};

exports.joinClass = async (req, res, next) => {
  const userId = req.decodedToken.userId;
  const classId = req.body.classId;
  const db = Db.db;
  const socket = socketIO.io.sockets.connected[socketIO.socketId.get(userId)];
  if (classId) {
    try {
      console.log(classId, userId);
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
      if (error.errno === 1062) {
        next(new SystemError(409, "You have already joined this class!"));
      } else next(error);
    }
  } else return res.status(500).json("invalid classId");
};

exports.sendInvitation = async (req, res, next) => {
  const { invitationList, classId } = req.body;
  const db = Db.db;
  console.log(classId);
  try {
    const [classInfo] = await db.query(
      "SELECT * FROM class WHERE classId = ?",
      classId
    );
    const className = classInfo[0].name;
    const inviteSet = new Set();
    for (const person of Object.values(invitationList)) {
      inviteSet.add(person.email);
      console.log(person);
    }
    const mailList = Array.from(inviteSet.values());
    await transporter.sendMail({
      to: mailList,
      subject: "New invitation from Remind", // Tiêu đề mail
      text: "Click this link to join my class 😘", // Nội dung mail dạng text
      html: `<div style="text-align:left;padding-left:2rem;">
      <h2>Someone wants to invite you to join a class named<span style="color:#546A8C"> ${className}</span> , if interested, please click on the link below😉</h2>
      <a target="_blank" href="${process.env.CLIENT_URL}/join?classId=${classId}">Join</a>
      </div>`, // Nội dung mail dạng html
    });
    return res
      .status(201)
      .json({ message: "The invitation emails has been sent" });
  } catch (error) {
    next(error);
  }
};

exports.getClassSettings = async (req, res, next) => {
  try {
    const { userId } = req.decodedToken;
    let { classId } = req.query;
    console.log(classId);
    const db = Db.db;
    const [classData] = await db.query(
      "SELECT * FROM class WHERE classId = ?",
      classId
    );
    if (classData.length === 0)
      return res.status(404).json({ message: "Could not find class" });
    const [ownerData] = await db.query(
      "SELECT id,name, avatar FROM user_info WHERE id= ?",
      classData[0].owner
    );
    const [
      searchMember,
    ] = await db.query(
      "SELECT * FROM class_member WHERE classId = ? AND userId = ?",
      [classId, userId]
    );
    if (searchMember.length === 0)
      return res.status(404).json({ message: "Could not find class" });
    const { name, classId: cId, avatar } = classData[0];
    if (classData[0].owner === userId) {
      return res.status(200).json({
        permissions: {
          modify: true,
          leave: false,
        },
        data: {
          name,
          classId: cId,
          avatar,
        },
        ownerData: {
          ...ownerData[0],
        },
      });
    } else {
      return res.status(200).json({
        permissions: {
          leave: true,
          modify: false,
        },
        data: {
          name,
          classId: cId,
          avatar,
        },
        ownerData: {
          ...ownerData[0],
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.modifyClass = async (req, res, next) => {
  try {
    const db = Db.db;
    const { classId, name } = req.body;
    if (!classId || !name) {
      return res.status(404).json({
        message: "Cannot edit with those info",
      });
    }
    let file = req.file;
    let avatar = null;
    if (file) {
      avatar =
        req.protocol + "://" + req.get("host") + "/images/" + req.file.filename;
    }
    let depArr = [name, avatar, classId];
    if (!avatar) depArr = [name, classId];
    await db.query(
      `UPDATE class SET name=? ${
        avatar ? `, avatar = ?` : ""
      } WHERE classId = ?`,
      depArr
    );
    return res.status(201).json({
      message: "Successfully edit class",
    });
  } catch (error) {
    next(error);
  }
};
