const socketIO = require("../configs/socketIO");
const schedule = require("node-schedule");

const Db = require("../Database/db");
const { ROLE } = require("../Utils/ROLE");
exports.sendMessage = async (req, res) => {
  const userId = req.decodedToken.userId;
  const roomId = req.query.roomId;
  const file = req.file;
  const socket = socketIO.io.sockets.connected[socketIO.socketId.get(userId)];
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
    console.log(socket.rooms);
    if (!socket.rooms[`class-${roomId}-all`]) {
      socket.join(`class-${roomId}-all`);
    }
    socket.to(`class-${roomId}-all`).emit("messages", { ...getBack[0] });
    return res.status(200).json(getBack[0]);
  } catch (error) {
    throw error;
  }
};
exports.sendAnnouncement = async (req, res) => {
  const userId = req.decodedToken.userId;
  console.log(req.body);
  const { roomIds, content, scheduleTime } = req.body;
  const userSocket =
    socketIO.io.sockets.connected[socketIO.socketId.get(userId)];
  const rooms = Object.fromEntries(
    roomIds.split(",").map((s) => {
      return s.split(":");
    })
  );
  console.log(rooms);
  const file = req.file;
  const db = Db.db;
  let filePath = null;
  const scheduleId = Date.now(); //=scheduleId
  if (file) {
    filePath =
      req.protocol + "://" + req.get("host") + "/images/" + req.file.filename;
  }
  let sendAnnouncementQuery = `INSERT INTO messages(senderId, roomId, content,file, type,target) VALUES ?`;
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
          const [send] = await db.query(sendAnnouncementQuery, [
            getBackScheduleValues,
          ]);
          const [
            getBack,
          ] = await db.query(
            `SELECT * FROM messages WHERE id BETWEEN ? AND ?`,
            [send.insertId, send.insertId + +send.affectedRows]
          );
          console.log(fireDate);
          // if (userSocket) {
          for (let back of getBack) {
            // userSocket.emit("messages", { ...getBack[index] });
            // userSocket
            userSocket.emit("messages", { ...back });
            userSocket
              .to(`class-${back.roomId}-${back.target}`)
              .emit("messages", { ...back });
          }
          // }
        }
      );
      return res.status(200).json({
        rooms,
        userId,
        filePath,
      });
    }
  }
  //send immediately
  console.log("expried");

  let values = Object.entries(rooms).map((room) => {
    return [userId, room[0], content, filePath, 1, room[1]];
  });
  const [send] = await db.query(sendAnnouncementQuery, [values]);
  const [
    getBack,
  ] = await db.query(`SELECT * FROM messages WHERE id BETWEEN ? AND ?`, [
    send.insertId,
    send.insertId + send.insertId + send.affectedRows,
  ]);

  // if (userSocket) {
  for (let back of getBack) {
    // userSocket.emit("messages", { ...getBack[index] });
    // userSocket
    userSocket.emit("messages", { ...back });
    userSocket
      .to(`class-${back.roomId}-${back.target}`)
      .emit("messages", { ...back });
  }
  // }

  return res.status(200).json({
    rooms,
    userId,
    filePath,
  });
};

//
exports.getScheduleDetails = async (req, res) => {
  const userId = req.decodedToken.userId;
  const db = Db.db;
  const { scheduleId } = req.query;
  const getDetailsQuery =
    "SELECT * FROM announcement_schedule WHERE senderId = ? AND scheduleId=? AND done=false";
  try {
    // const [info] = await db.query(getRequireInfoQuery, [scheduleId]);
    // const scheduleId = info[0].scheduleId;
    const [details] = await db.query(getDetailsQuery, [userId, scheduleId]);
    if (details.length > 0) {
      const mergedDetail = {
        ...details[0],
        roomIds: Object.fromEntries(
          details.map((detail) => {
            //TODO: GET ANNOUNCEMENT TARGET:parent, student...
            return [detail.roomId, detail.target];
          })
        ),
      };
      return res.status(200).json(mergedDetail);
    }
    return res.status(404).json("schedule not found");
  } catch (error) {
    res.status(500).json("Server Error");
  }
};

//edit schedule
exports.editSchedule = async (req, res) => {
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
      return res.status(404).json("Schedule have been sent!");
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
        const [send] = await db.query(sendAnnouncementQuery, [
          getBackScheduleValues,
        ]);
        const [
          getBack,
        ] = await db.query(`SELECT * FROM messages WHERE id BETWEEN ? AND ?`, [
          send.insertId,
          send.insertId + +send.affectedRows,
        ]);
        console.log(fireDate);
        // if (userSocket) {
        for (let back of getBack) {
          // userSocket.emit("messages", { ...getBack[index] });
          // userSocket
          userSocket.emit("messages", { ...back });
          userSocket
            .to(`class-${back.roomId}-${back.target}`)
            .emit("messages", { ...back });
        }
        // }
      }
    );
    res.status(200).json("Oke");
  } catch (error) {
    res.status(500).json("Server Error");
    throw error;
  }
};
exports.deleteSchedule = async (req, res) => {
  const userId = req.decodedToken.userId;
  const { scheduleId } = req.query;
  const db = Db.db;
  console.log("d");
  try {
    await db.query(
      "DELETE FROM announcement_schedule WHERE scheduleId = ? AND senderId = ?",
      [scheduleId, userId]
    );
    res.status(200).json("Delete success");
  } catch (error) {
    res.status(500).json("SERVER ERROR");
    throw error;
  }
};
exports.getMessages = async (req, res) => {
  const userId = req.decodedToken.userId;
  const roomId = req.query.roomId;
  const db = Db.db;
  console.log("Get message");
  const role = req.userData.role;
  console.log("role", ROLE[role]);
  try {
    const [
      messages,
    ] = await db.query(
      `SELECT * FROM messages WHERE roomId= ? AND (target='all' OR target=?) ORDER BY createAt`,
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
    res.status(404).json("Server error");
  }
};
exports.getFiles = async (req, res) => {
  const { classId } = req.query;
  console.log("GETFIE");
  const db = Db.db;
  const [[{ roomId }]] = await db.query(
    "SELECT roomId FROM message_room WHERE classId = ?",
    classId
  );
  const [files] = await db.query(
    "SELECT * FROM messages WHERE roomId = ? AND file IS NOT NULL",
    roomId
  );
  console.log(files);
  setTimeout(() => {
    res.status(200).json(files);
  }, 500);
};

exports.getFileDetails = async (req, res) => {
  const { messageId } = req.query;
  const db = Db.db;
  const [
    [fileDetails],
  ] = await db.query(
    "SELECT m.*, ui.id as userId, ui.firstName as firstName,ui.lastname as lastName, ui.avatar as avatar  FROM (SELECT * FROM messages m  WHERE id = ?) m INNER JOIN user_info ui ON m.senderId = ui.id",
    [messageId]
  );
  console.log(fileDetails);
  res.status(200).json(fileDetails);
};

exports.initialPrivateRoom = async (req, res) => {
  const userId = req.decodedToken.userId;
  const db = Db.db;
  const { receiverId } = req.body;
  if (userId === receiverId) {
    return res.status(409).json("You cant message to yourself!");
  }
  const [usersExist] = await db.query(
    "SELECT * FROM user_info WHERE id IN (?)",
    [[userId, receiverId]]
  );
  if (usersExist.length < 2) {
    return res.status(404).json("User not found!");
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
  console.log(roomIsAvailable[0]);
  res.status(200).json(roomIsAvailable[0]);
};

exports.getPrivateConversationData = async (req, res) => {
  const userId = req.decodedToken.userId;
  const { classId } = req.query;
  const db = Db.db;
  const [
    privateRooms,
  ] = await db.query(
    "SELECT * FROM message_room WHERE (member2 =? AND member1 IN (SELECT userId FROM class_member WHERE classId = ?)) or (member1 = ? AND member2 IN (SELECT userId FROM class_member WHERE classId = ?))",
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
  const [
    getUsersDetails,
  ] = await db.query("SELECT * FROM user_info WHERE id IN (?)", [userList]);

  res.status(200).json(getUsersDetails);
};
