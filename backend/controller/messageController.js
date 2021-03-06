const socketIO = require("../configs/socketIO");
const schedule = require("node-schedule");
const transporter = require("../Mailer/Mailer.js");
const Db = require("../Database/db");
const { ROLE } = require("../Utils/ROLE");
// const Redis = require("../configs/Redis");
const SystemError = require("../models/Error");
const sanitizeHtml = require("sanitize-html");

// sanitizeHtml.defaults.allowedAttributes = {
//   ...sanitizeHtml.defaults.allowedAttributes,
//   a: [...sanitizeHtml.defaults.allowedAttributes.a, "target"],
// };

const getDataFromRoomId = async (roomId) => {
  return Db.db.query("");
};

const sendAnnouncement = async (values, sendAnnouncementQuery, userSocket) => {
  const [send] = await Db.db.query(sendAnnouncementQuery, [values]);
  // const [
  //   getBack,
  // ] = await Db.db.query(`SELECT * FROM messages WHERE id BETWEEN ? AND ?`, [
  //   send.insertId,
  //   send.insertId + send.insertId + send.affectedRows,
  // ]);
  const [
    getBack,
  ] = await Db.db.query(
    "select classId, name,mg.* from (select * from messages WHERE id BETWEEN ? AND ?) mg INNER join (select cl.*, mr.roomId roomId FROM message_room mr INNER JOIN class cl ON cl.classId = mr.classId) mr ON mg.roomId = mr.roomId",
    [send.insertId, send.insertId + send.insertId + send.affectedRows]
  );

  userSocket.emit("schedule", {
    type: "SCHEDULE_DONE",
  });
  // let roomList = [];
  let classList = [];
  for (let back of getBack) {
    // classList.push({
    //   ...JSON.parse(await Redis.getAsync(`class-room-${back.roomId}`)),
    //   target: back.target,
    // });
    const { classId, name, target } = back;
    classList.push({ classId, name, target });
    // roomList.push({
    //   roomId: back.roomId,
    //   target: back.target,
    // });
    userSocket.emit("messages", { ...back });
    userSocket
      .to(`class-${back.roomId}-${back.target}`)
      .emit("messages", { ...back });
  }
  // send emails to members
  classList.forEach(async (classData) => {
    const promiseList = [];
    promiseList.push(
      Db.db.query(
        `SELECT * FROM (SELECT * FROM user_info WHERE id IN (SELECT userId FROM class_member WHERE classId = ?) AND role <> 0 ${
          classData.target !== "all" ? "AND role =?" : ""
        }) ui INNER JOIN user u ON ui.id = u.id`,
        [classData.classId, ROLE[classData.target.toLowerCase()]]
      )
    );
    const targetList = (await Promise.all(promiseList)).map(
      (list) => list[0]
    )[0];
    console.log("targetList", targetList);
    const mailList = targetList.map((person) => {
      return person.email;
    });
    console.log("maillist", mailList);
    if (mailList.length > 0) {
      const mail = {
        to: mailList,
        subject: `You have 1 new announcement from your class:${classData.name}`, // Tiêu đề mail
        text: `You have 1 new announcement from your class:${classData.name}`, // Nội dung mail dạng text
        html: `<div style="text-align:left;padding-left:2rem;">
            <h2>Your class:<span style="color:#546A8C"> ${classData.name}</span> has 1 new announcement, Click on the link below to check😉</h2>
            <a target="_blank" href="${process.env.CLIENT_URL}/classes/${classData.classId}">${classData.name}</a>
            </div>`, // Nội dung mail dạng html
      };
      transporter.sendMail(mail);
    }
    //send to parents
    Db.db
      .query(
        "SELECT * FROM user WHERE id IN (select parentId from relationship WHERE childId IN (SELECT userId FROM class_member WHERE classId= ?))",
        classData.classId
      )
      .then((data) => {
        const parentMailList = data[0].map((parent) => parent.email);
        if (parentMailList.length > 0) {
          transporter.sendMail({
            to: parentMailList,
            subject: `Your children have 1 new announcement from your class:${classData.name}`, // Tiêu đề mail
            text: `Your children have 1 new announcement from your class:${classData.name}`, // Nội dung mail dạng text
            html: `<div style="text-align:left;padding-left:2rem;">
                  <h2>Your children's class:<span style="color:#546A8C"> ${classData.name}</span> has 1 new announcement, Click on the link below to check😉</h2>
                  <a target="_blank" href="${process.env.CLIENT_URL}/classes/${classData.classId}">${classData.name}</a>
                  </div>`, // Nội dung mail dạng html
          });
        }
      });
  });
};

exports.sendMessage = async (req, res, next) => {
  const userId = req.decodedToken.userId;
  // console.log("send", userId);
  // console.log(socketIO.socketId, userId, socketIO.io.sockets.connected);
  const roomId = req.query.roomId;
  const file = req.file;
  const socket = socketIO.io.sockets.connected[socketIO.socketId.get(userId)];
  let { content } = req.body;
  content = sanitizeHtml(content);
  console.log("CONTENT", content);
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
    if (!socket.rooms[`class-${roomId}-all`]) {
      socket.join(`class-${roomId}-all`);
    }
    socket.to(`class-${roomId}-all`).emit("messages", { ...getBack[0] });
    return res.status(200).json(getBack[0]);
  } catch (error) {
    next(error);
  }
};
exports.sendAnnouncement = async (req, res, next) => {
  const userId = req.decodedToken.userId;
  let { roomIds, content, scheduleTime } = req.body;
  content = sanitizeHtml(content, {
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { target: "_blank" }),
    },
  });
  const userSocket =
    socketIO.io.sockets.connected[socketIO.socketId.get(userId)];
  const rooms = Object.fromEntries(
    roomIds.split(",").map((s) => {
      return s.split(":");
    })
  );
  const file = req.file;
  const db = Db.db;
  let filePath = null;
  const scheduleId = Date.now(); //=scheduleId
  if (file) {
    filePath =
      req.protocol + "://" + req.get("host") + "/images/" + req.file.filename;
  }
  let sendAnnouncementQuery = `INSERT INTO messages(senderId, roomId, content,file, type,target) VALUES ?`;
  try {
    if (
      scheduleTime &&
      new Date(Date.parse(scheduleTime)) - new Date(Date.now()) > 0
    ) {
      console.log("set schedule", scheduleTime);
      const scheduleTimeInMysql = new Date(scheduleTime)
        .toISOString()
        .replace(/T|\..+$/g, " ");
      const insertToStoreIdQuery = `INSERT INTO announcement_schedule(scheduleId, senderId, roomId, content,file, type,target,time,createAtMs) VALUES ?`;
      const storeValues = Object.entries(rooms).map((room) => {
        return [
          scheduleId,
          userId,
          room[0],
          content,
          filePath,
          1,
          room[1],
          scheduleTimeInMysql,
          scheduleId,
        ];
      });
      const [storedSchedule] = await db.query(insertToStoreIdQuery, [
        storeValues,
      ]); //when server down, fetch schedule and excute
      console.log(storedSchedule);
      if (new Date(Date.parse(scheduleTime)) - new Date(Date.now()) > 0) {
        const [
          getBackSchedule,
        ] = await db.query(
          `SELECT * FROM announcement_schedule WHERE scheduleId=?`,
          [scheduleId]
        );
        console.log(getBackSchedule);
        userSocket.emit("schedule", {
          type: "SCHEDULE_START",
          schedule: {
            ...getBackSchedule[0],
          },
        });
        //end-fixed
        schedule.scheduleJob(
          `schedule-${scheduleId}`,
          scheduleTime,
          async (fireDate) => {
            console.log(scheduleId);
            const getBackStoredScheduleQuery = `SELECT senderId, roomId, content, file, type,target FROM announcement_schedule WHERE scheduleId =?`;
            const [getBackSchedule] = await db.query(
              getBackStoredScheduleQuery,
              scheduleId
            );
            //set done
            const setDoneQuery = `UPDATE announcement_schedule SET done = true  WHERE scheduleId =?`;
            await db.query(setDoneQuery, scheduleId);
            //sendAnnouncement
            const getBackScheduleValues = getBackSchedule.map((gBS) => {
              return Object.values(gBS);
            });
            await sendAnnouncement(
              getBackScheduleValues,
              sendAnnouncementQuery,
              userSocket
            );
          }
        );
        return res.status(200).json({
          rooms,
          userId,
          filePath,
          message: "You've created a scheduled announcement",
        });
      }
    }
    //send immediately
    console.log("expired");

    let values = Object.entries(rooms).map((room) => {
      return [userId, room[0], content, filePath, 1, room[1]];
    });
    sendAnnouncement(values, sendAnnouncementQuery, userSocket);

    res.status(200).json({
      rooms,
      userId,
      filePath,
      message: "You've created a announcement",
    });
  } catch (error) {
    next(error);
  }
};

//
exports.getScheduleDetails = async (req, res, next) => {
  const userId = req.decodedToken.userId;
  const db = Db.db;
  const { scheduleId } = req.query;
  const getDetailsQuery =
    "SELECT * FROM announcement_schedule WHERE senderId = ? AND scheduleId=? AND done=false";
  try {
    const [details] = await db.query(getDetailsQuery, [userId, scheduleId]);
    if (details.length > 0) {
      const mergedDetail = {
        ...details[0],
        roomIds: Object.fromEntries(
          details.map((detail) => {
            return [detail.roomId, detail.target];
          })
        ),
      };
      return res.status(200).json(mergedDetail);
    }
    return res.status(404).json("schedule not found");
  } catch (error) {
    next(error);
  }
};

//edit schedule
exports.editSchedule = async (req, res, next) => {
  const userId = req.decodedToken.userId;
  const userSocket =
    socketIO.io.sockets.connected[socketIO.socketId.get(userId)];
  const { scheduleId } = req.query;
  const db = Db.db;
  const newFile = req.file; //if(file) ==> change file
  let newFilePath = null;
  if (newFile) {
    newFilePath =
      req.protocol + "://" + req.get("host") + "/images/" + req.file.filename;
  }
  const { roomIds, content, scheduleTime, file } = req.body;
  const rooms = Object.fromEntries(
    roomIds.split(",").map((s) => {
      return s.split(":");
    })
  );
  try {
    const [getStoredSchedule] = await db.query(
      "SELECT * FROM announcement_schedule WHERE scheduleId =? AND done=false",
      scheduleId
    );
    const scheduleTimeInMysql = new Date(scheduleTime)
      .toISOString()
      .replace(/T|\..+$/g, " ");
    if (getStoredSchedule.length <= 0) {
      throw new SystemError(404, "Schedule have been sent!");
    }
    //delete old schedule
    await db.query(
      "DELETE FROM announcement_schedule WHERE scheduleId=?",
      scheduleId
    );
    //add new schedule which has same id
    let newScheduleValues;
    if (newFilePath) {
      console.log("file changes");
      newScheduleValues = Object.entries(rooms).map((room) => {
        return [
          scheduleId,
          userId,
          room[0],
          content,
          newFilePath,
          1,
          room[1],
          scheduleTimeInMysql,
        ];
      });
    } else {
      const oldFilePath = getStoredSchedule[0].file;
      newScheduleValues = Object.entries(rooms).map((room) => {
        return [
          scheduleId,
          userId,
          room[0],
          content,
          oldFilePath,
          1,
          room[1],
          scheduleTimeInMysql,
        ];
      });
      console.log("old file");
    }
    console.log(newScheduleValues);
    await db.query(
      "INSERT INTO announcement_schedule(scheduleId, senderId, roomId, content,file, type,target, time) VALUES ?",
      [newScheduleValues]
    );
    schedule.scheduledJobs[`schedule-${scheduleId}`].cancel();
    schedule.scheduleJob(
      `schedule-${scheduleId}`,
      scheduleTime,
      async (fireDate) => {
        console.log(scheduleId);
        const getBackStoredScheduleQuery = `SELECT senderId, roomId, content, file, type,target FROM announcement_schedule WHERE scheduleId =?`;
        const [getBackSchedule] = await db.query(
          getBackStoredScheduleQuery,
          scheduleId
        );
        //set done
        const setDoneQuery = `UPDATE announcement_schedule SET done = true  WHERE scheduleId =?`;
        await db.query(setDoneQuery, scheduleId);
        //sendAnnouncement
        const getBackScheduleValues = getBackSchedule.map((gBS) => {
          return Object.values(gBS);
        });
        const rooms = getBackScheduleValues.map((gBS) => {
          return gBS.roomId;
        });
        let sendAnnouncementQuery = `INSERT INTO messages(senderId, roomId, content,file, type,target) VALUES ?`;
        await sendAnnouncement(
          getBackScheduleValues,
          sendAnnouncementQuery,
          userSocket
        );
        userSocket.emit("schedule", {
          type: "SCHEDULE_DONE",
        });
      }
    );
    return res.status(200).json({ message: "You've edited your announcement" });
  } catch (error) {
    next(error);
  }
};
exports.deleteSchedule = async (req, res, next) => {
  const userId = req.decodedToken.userId;
  const userSocket =
    socketIO.io.sockets.connected[socketIO.socketId.get(userId)];
  const { scheduleId } = req.query;
  const db = Db.db;
  console.log("d");
  try {
    await db.query(
      "DELETE FROM announcement_schedule WHERE scheduleId = ? AND senderId = ?",
      [scheduleId, userId]
    );
    userSocket.emit("schedule", {
      type: "SCHEDULE_CANCEL",
      // schedule: {
      //   ...getBackSchedule[0],
      // },
    });
    res.status(200).json("Delete success");
  } catch (error) {
    res.status(500).json("SERVER ERROR");
    next(error);
  }
};
exports.getMessages = async (req, res, next) => {
  const { userId } = req.decodedToken;
  const { roomId } = req.query;
  const db = Db.db;
  console.log("Get message");
  // const role = req.userData.role;
  try {
    const [getRole] = await db.query(
      "SELECT * FROM user_info WHERE id=?",
      userId
    );
    if (getRole.length === 0)
      return res.status(404).json({ message: "User doesn't exist" });
    const role = getRole[0].role;
    const [
      messages,
    ] = await db.query(
      `SELECT * FROM messages WHERE roomId= ?  ${
        ROLE[role] === "teacher" ? "" : "AND (target='all' OR target=?)"
      }  ORDER BY createAt`,
      [roomId, ROLE[role]]
    );
    const [
      schedules,
    ] = await db.query(
      `SELECT * FROM announcement_schedule WHERE roomId = ? AND senderId = ? AND done = false`,
      [roomId, userId]
    );
    res.status(200).json({ messages, schedules });
  } catch (error) {
    next(error);
  }
};

exports.getSchedules = async (req, res, next) => {
  const { roomId } = req.query;
  const userId = req.decodedToken.userId;
  const db = Db.db;
  try {
    const [
      schedules,
    ] = await db.query(
      `SELECT * FROM announcement_schedule WHERE roomId = ? AND senderId = ? AND done = false`,
      [roomId, userId]
    );
    res.status(200).json(schedules);
  } catch (error) {
    next(error);
  }
};

exports.getFiles = async (req, res, next) => {
  const { classId } = req.query;
  const db = Db.db;
  try {
    const [[{ roomId }]] = await db.query(
      "SELECT roomId FROM message_room WHERE classId = ?",
      classId
    );
    const [files] = await db.query(
      "SELECT * FROM messages WHERE roomId = ? AND file IS NOT NULL",
      roomId
    );
    res.status(200).json(files);
  } catch (error) {
    next(error);
  }
};

exports.getFileDetails = async (req, res, next) => {
  const { messageId } = req.query;
  const db = Db.db;
  try {
    const [
      [fileDetails],
    ] = await db.query(
      "SELECT m.*, ui.id as userId, ui.firstName as firstName,ui.lastname as lastName, ui.avatar as avatar  FROM (SELECT * FROM messages m  WHERE id = ?) m INNER JOIN user_info ui ON m.senderId = ui.id",
      [messageId]
    );
    res.status(200).json(fileDetails);
  } catch (error) {
    next(error);
  }
};

exports.initialPrivateRoom = async (req, res, next) => {
  const userId = req.decodedToken.userId;
  const db = Db.db;
  const { receiverId } = req.body;
  try {
    if (userId === receiverId) {
      throw new SystemError(409, "You cant message to yourself!");
    }
    const [
      usersExist,
    ] = await db.query("SELECT * FROM user_info WHERE id IN (?)", [
      [userId, receiverId],
    ]);
    if (usersExist.length < 2) {
      throw new SystemError(404, "User not found!");
    }
    let [
      roomIsAvailable,
    ] = await db.query(
      "SELECT * FROM message_room WHERE privateMember = ? or privateMember= ?",
      [`${userId},${receiverId}`, `${receiverId},${userId}`]
    );
    if (roomIsAvailable.length === 0) {
      await db.query(
        "INSERT INTO message_room(privateMember,member1, member2) VALUE(?,?,?)",
        [`${userId},${receiverId}`, userId, receiverId]
      );
      [
        roomIsAvailable,
      ] = await db.query(
        "SELECT * FROM message_room WHERE privateMember = ? or privateMember= ?",
        [`${userId},${receiverId}`, `${receiverId},${userId}`]
      );
    }
    res.status(200).json(roomIsAvailable[0]);
  } catch (error) {
    next(error);
  }
};

exports.getPrivateConversationData = async (req, res, next) => {
  const userId = req.decodedToken.userId;
  const { classId } = req.query;
  const db = Db.db;
  try {
    const [
      privateRooms,
    ] = await db.query(
      "SELECT * FROM message_room WHERE (member2 = ? AND member1 IN (SELECT userId FROM class_member WHERE classId = ?)) or (member1 = ? AND member2 IN (SELECT userId FROM class_member WHERE classId = ?))",
      [userId, classId, userId, classId]
    );
    const userSet = new Set(
      privateRooms
        .map((r) => [r.member1, r.member2])
        .flat()
        .filter((u) => u !== userId)
    );
    const userList = Array.from(userSet.values());
    console.log(userList);
    if (userList.length === 0) return res.status(200).json([]);
    const [
      getUsersDetails,
    ] = await db.query("SELECT * FROM user_info WHERE id IN (?)", [userList]);

    res.status(200).json(getUsersDetails);
  } catch (error) {
    next(error);
  }
};
