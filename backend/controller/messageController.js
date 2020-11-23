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
  const createAtMs = Date.now();
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
      .replace(/T|\..+$/g, " ");
    const insertToStoreIdQuery = `INSERT INTO announcement_schedule(senderId, roomId, content,file, type,time,createAtMs) VALUES ?`;
    const getBackStoredScheduleQuery = `SELECT senderId, roomId, content, file, type FROM announcement_schedule WHERE scheduleId BETWEEN ? AND ?`;
    const setDoneQuery = `UPDATE announcement_schedule SET done = true  WHERE scheduleId BETWEEN ? AND ?`;
    const storeValues = rooms.map((room) => {
      return [
        userId,
        room,
        content,
        filePath,
        1,
        scheduleTimeInMysql,
        createAtMs,
      ];
    });

    const [storedSchedule] = await db.query(insertToStoreIdQuery, [
      storeValues,
    ]); //when server down, fetch schedule and excute
    if (new Date(Date.parse(scheduleTime)) - new Date(Date.now()) > 0) {
      const [
        getBackSchedule,
      ] = await db.query(
        `SELECT * FROM announcement_schedule WHERE scheduleId BETWEEN ? AND ?`,
        [
          storedSchedule.insertId,
          storedSchedule.insertId + storedSchedule.affectedRows,
        ]
      );

      userSocket.emit("schedule", {
        type: "SCHEDULE_START",
        schedule: {
          ...getBackSchedule[0],
        },
      });
      schedule.scheduleJob(
        `${userId}-${createAtMs}`,
        scheduleTime,
        async (fireDate) => {
          const scheduled = storedSchedule;
          console.log(scheduled);
          const range = [
            scheduled.insertId,
            scheduled.insertId + scheduled.affectedRows,
          ];
          const [getBackSchedule] = await db.query(
            getBackStoredScheduleQuery,
            range
          );
          //set done
          await db.query(setDoneQuery, range);
          //sendAnnouncement
          const getBackScheduleValues = getBackSchedule.map((gBS) => {
            return Object.values(gBS);
          });
          const [send] = await db.query(query, [getBackScheduleValues]);
          const [
            getBack,
          ] = await db.query(
            `SELECT * FROM messages WHERE id BETWEEN ? AND ?`,
            [send.insertId, send.insertId + +send.affectedRows]
          );
          console.log(fireDate);
          // if (userSocket) {
          for (let index in getBack) {
            // userSocket.emit("messages", { ...getBack[index] });
            // userSocket
            socketIO.io
              .in(`class-${rooms[index]}`)
              .emit("messages", { ...getBack[index] });
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
  const [send] = await db.query(query, [values]);
  const [
    getBack,
  ] = await db.query(`SELECT * FROM messages WHERE id BETWEEN ? AND ?`, [
    send.insertId,
    send.insertId + send.insertId + send.affectedRows,
  ]);

  // if (userSocket) {
  for (let index in getBack) {
    // userSocket.emit("messages", { ...getBack[index] });
    // userSocket
    socketIO.io
      .in(`class-${rooms[index]}`)
      .emit("messages", { ...getBack[index] });
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
  const getRequireInfoQuery =
    "SELECT createAtMs from announcement_schedule WHERE scheduleId = ?";
  const getDetailsQuery =
    "SELECT * FROM announcement_schedule WHERE senderId = ? AND createAtMs=? AND done=false";
  try {
    const [info] = await db.query(getRequireInfoQuery, [scheduleId]);
    const createAtMs = info[0].createAtMs;
    const [details] = await db.query(getDetailsQuery, [userId, createAtMs]);
    if (details.length > 0) {
      const mergedDetail = {
        ...details[0],
        roomIds: Object.fromEntries(
          details.map((detail) => {
            return [detail.roomId, "all"];
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
  const db = Db.db;
  const newFile = req.file; //if(file) ==> change file
  let newFilePath = null;
  if (newFile) {
    newFilePath =
      req.protocol + "://" + req.get("host") + "/images/" + req.file.filename;
  }
  const { roomIds, content, scheduleTime, file } = req.body;
  if (newFilePath) {
    console.log("file changes");
  } else {
    console.log("old file");
  }
  console.log({
    ...req.body,
    newFilePath,
  });
  //edit query
  const editQuery = `UPDATE announcement_schedule SET()`;
  res.status(200).json("Oke");
};

exports.getMessages = async (req, res) => {
  const userId = req.decodedToken.userId;
  const roomId = req.query.roomId;
  const db = Db.db;
  console.log("Get message");
  try {
    const [
      messages,
    ] = await db.query(
      `SELECT * FROM messages WHERE roomId= ? ORDER BY createAt`,
      [roomId]
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
