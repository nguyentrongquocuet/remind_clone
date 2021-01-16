const Db = require("../Database/db");
const AnalysisDb = require("../Database/AnalysisDb");
const { validationResult } = require("express-validator");
const SystemError = require("../models/Error");
const normalizeName = require("../Utils/NomalizeName");

const tableField = {
  user: [
    "id",
    "email",
    "password",
    "createAt",
    "verified",
    "verifyCode",
    "refreshToken",
  ],
  user_info: [
    "id",
    "name",
    "firstName",
    "lastName",
    "role",
    "region",
    "school",
    "birthday",
    "gender",
    "avatar",
    "lastUpdate",
  ],
};

exports.getUserAmount = async (req, res, next) => {
  try {
    const db = Db.db;

    const [amount] = await db.query("SELECT COUNT(*) amount FROM user");
    console.log(amount[0]);
    res.status(200).json({ ...amount[0], lastUpdate: new Date() });
  } catch (error) {
    next(error);
  }
};

exports.getClassAmount = async (req, res, next) => {
  try {
    const db = Db.db;
    const [amount] = await db.query("SELECT COUNT(*) amount FROM class");
    console.log(amount[0]);
    res.status(200).json({ ...amount[0], lastUpdate: new Date() });
  } catch (error) {
    next(error);
  }
};

exports.getRequestAmount = async (req, res, next) => {
  try {
    const [requestAmountInfo] = await AnalysisDb.db.query(
      "SELECT * FROM analysis WHERE name LIKE '%request%'"
    );
    const finalOutput = requestAmountInfo.reduce((out, reqType) => {
      out[reqType.name] = reqType;
      return out;
    }, {});
    res.status(200).json(finalOutput);
  } catch (error) {
    next(error);
  }
};

exports.getSavedFileAmount = async (req, res, next) => {
  try {
    const [savedFileInfo] = await AnalysisDb.db.query(
      "SELECT * FROM analysis WHERE id = 5"
    );
    res.status(200).json(savedFileInfo[0]);
  } catch (error) {
    next(error);
  }
};

exports.getVisitorAmount = async (req, res, next) => {
  try {
    const [visitorAmount] = await AnalysisDb.db.query(
      "SELECT * FROM analysis WHERE name='visitors'"
    );
    res.status(200).json(visitorAmount[0]);
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  const db = Db.db;
  const { id } = req.query;
  try {
    const [user] = await db.query(
      "SELECT * FROM user INNER JOIN user_info ON user.id= user_info.id AND user.id = ?",
      id
    );
    if (user.length <= 0) throw new SystemError(404, "User not found!");
    return res.status(200).json(user[0]);
  } catch (error) {
    next(error);
  }
};

exports.getUsersClasses = async (req, res, next) => {
  const db = Db.db;
  const { id } = req.query;
  try {
    const [classes] = await db.query(
      "SELECT avatar,classId, name FROM class WHERE classId IN (SELECT classId FROM class_member WHERE userId = ?)",
      id
    );
    res.status(200).json({ classes });
  } catch (error) {
    next(error);
  }
};

exports.getUsersRelationships = async (req, res, next) => {
  const db = Db.db;
  const { id } = req.query;
  try {
    const [
      relationships,
    ] = await db.query(
      "SELECT id,avatar, name FROM user_info ui INNER JOIN (SELECT * FROM relationship WHERE parentId = ? OR childId = ?) r  ON ui.id = r.parentId OR ui.id = r.childId  ",
      [id, id]
    );
    const final = relationships.filter((r) => r.id != id);
    res.status(200).json({ relationships: final });
  } catch (error) {
    next(error);
  }
};

// exports.forceRemoveUserFromClass = async (req, res, next)=>{
//   const db = Db.db;
//   const {userId, classId,reason} = req.body;
//   const [kickOut] = await db.query("")
// }

exports.getUsers = async (req, res, next) => {
  const db = Db.db;
  console.log(req.query);
  const {
    filterField,
    filterCon,
    page,
    rowsPerPage,
    sortBy,
    desc,
    nameQuery,
  } = req.query;
  const numPage = parseInt(page);
  const numRowsPerPage = parseInt(rowsPerPage);
  const sortTable = Object.keys(tableField).find((key) =>
    tableField[key].includes(sortBy)
  );
  const filterTable = Object.keys(tableField).find((key) =>
    tableField[key].includes(filterField)
  );
  console.log(sortTable, filterTable);
  try {
    const [total] = await db.query(
      `SELECT COUNT(*) count FROM user INNER JOIN user_info WHERE user.id=user_info.id ${
        filterField && filterCon
          ? `AND ${filterTable}.${filterField} = '${filterCon}'`
          : ""
      } ${
        nameQuery
          ? `AND MATCH(firstName, lastName) AGAINST('${nameQuery}')`
          : ""
      } ${`ORDER BY ${sortTable}.${sortBy || "id"} ${desc ? "DESC" : ""}`}`
    );
    const query = `SELECT user.id id,avatar, name, role, createAt, lastUpdate FROM user INNER JOIN user_info WHERE user.id=user_info.id ${
      filterField && filterCon
        ? `AND user_info.${filterField} = '${filterCon}'`
        : ""
    } ${
      nameQuery ? `AND MATCH(firstName, lastName) AGAINST('${nameQuery}')` : ""
    } ${`ORDER BY ${sortTable}.${sortBy || "id"} ${desc ? "DESC" : ""}`} ${
      page && rowsPerPage ? "LIMIT ? OFFSET ?" : ""
    }`;
    const [user] = await db.query(query, [
      numRowsPerPage,
      numPage * numRowsPerPage,
    ]);
    res.status(200).json({ total: total[0].count, userList: user });
  } catch (error) {
    next(error);
  }
};
//like signup
exports.addPeople = async (req, res, next) => {
  const db = Db.db;
  const errors = validationResult(req);
  const file = req.file;
  let avatar = null;
  if (file) {
    avatar =
      req.protocol + "://" + req.get("host") + "/images/" + req.file.filename;
  }
  try {
    let {
      firstname,
      lastname,
      role,
      password,
      email,
      isVerified,
      birthday,
      gender,
    } = req.body;
    firstname = normalizeName(firstname);
    lastname = normalizeName(lastname);
    const name = firstname + " " + lastname;
    if (!errors.isEmpty()) {
      throw new SystemError(400, JSON.stringify(errors.array()));
    }
    const [
      checkIfEmailExist,
    ] = await db.query(`SELECT * FROM user WHERE email=?`, [email]);

    if (checkIfEmailExist.length > 0) {
      // console.log(checkIfEmailExist);
      // handle forgot password
      throw new SystemError(401, "Email has been used");
    }
    const [
      add,
    ] = await db.query(
      "INSERT INTO user(email, password, verified) VALUES (?,?,?)",
      [email, password, Boolean(isVerified)]
    );
    const [
      addInfo,
    ] = await db.query(
      "INSERT INTO user_info(id,name,firstName, lastName, role, birthday, gender, avatar) VALUES(?,?,?,?,?,?,?,?)",
      [add.insertId, name, firstname, lastname, role, birthday, gender, avatar]
    );
    res.status(200).json("You've created a user");
  } catch (error) {
    next(error);
  }
};

exports.editUserInfo = async (req, res, next) => {
  const db = Db.db;
  const errors = validationResult(req);
  const file = req.file;
  let avatar = null;
  if (file) {
    avatar =
      req.protocol + "://" + req.get("host") + "/images/" + req.file.filename;
  }
  try {
    const {
      id,
      firstname,
      lastname,
      role,
      password,
      email,
      isVerified,
      birthday,
      gender,
    } = req.body;
    const name = firstname.trim() + " " + lastname.trim();
    console.log(req.body);
    if (!errors.isEmpty()) {
      throw new SystemError(400, JSON.stringify(errors.array()));
    }
    const [checkIfUserExist] = await db.query(`SELECT * FROM user WHERE id=?`, [
      id,
    ]);

    if (checkIfUserExist.length < 0) {
      // console.log(checkIfEmailExist);
      // handle forgot password
      throw new SystemError(404, "User not found!!!");
    }
    const [
      add,
    ] = await db.query(
      "UPDATE user SET email=?, password=?, verified=? WHERE id=?",
      [email, password, Boolean(isVerified), id]
    );
    const [
      editInfo,
    ] = await db.query(
      "UPDATE user_info SET name = ? ,firstName = ?, lastName=?, role=?, birthday=?, gender=?, avatar=? WHERE id=?",
      [name, firstname, lastname, role, birthday, gender, avatar, id]
    );
    res.status(200).json("You've modified a user");
  } catch (error) {
    next(error);
  }
};

exports.removeUserFromClass = async (req, res, next) => {
  try {
    const db = Db.db;
    const { id, classId } = req.query;
    if (id && classId) {
      const [
        remove,
      ] = await db.query(
        "SELECT * FROM class_member WHERE classId =? AND userId= ?",
        [classId, id]
      );
      if (remove.length > 0) {
        const { classId, userId, type, joinAt } = remove[0];
        await db.query(
          "INSERT INTO banned_class_member(classId, userId, type, joinAt) VALUES (?)",
          [[classId, userId, type, joinAt]]
        );
        await db.query(
          "DELETE FROM class_member WHERE classId =? AND userId= ?",
          [classId, id]
        );
        return res.status(201).json({
          message: "Remove success",
        });
      }
    }
    return res.status(404).json("User not found!");
  } catch (error) {
    next(error);
  }
};

exports.revokeUser = async (req, res, next) => {
  try {
    const db = Db.db;
    const { id } = req.query;
    if (id) {
      const [findUser] = await db.query("SELECT * FROM user WHERE id = ?", [
        id,
      ]);
      if (findUser.length > 0) {
        if (findUser[0].bannedId > 0)
          return res
            .status(404)
            .json("User has been banned before, no more pain!!!");
      }
      const [
        insert,
      ] = await db.query("INSERT into banned_user(reason, id) VALUES(?)", [
        ["Admin ban", id],
      ]);
      await db.query(
        "UPDATE user SET bannedId = ?, refresh_key= NULL, verified=0 WHERE id = ?",
        [insert.insertId, id]
      );
      return res.status(201).json({
        message: "The user has been banned with the reason: " + "Admin ban",
      });
    }
    return res.status(404).json("User not found!");
  } catch (error) {
    next(error);
  }
};

exports.removeRelationship = async (req, res, next) => {
  try {
    const db = Db.db;
    const { firstId, secondId } = req.query;
    const [
      findRelationship,
    ] = await db.query(
      "SELECT * FROM relationship WHERE (parentId = ? AND childId = ?) OR (parentId = ? and childId = ?)",
      [firstId, secondId, secondId, firstId]
    );
    if (findRelationship.length === 0)
      return res.status(404).json("The relationship does not exist");

    await db.query(
      "DELETE FROM relationship  WHERE (parentId = ? AND childId = ?) OR (parentId = ? and childId = ?)",
      [firstId, secondId, secondId, firstId]
    );
    return res.status(201).json({
      message: "The relationship has been delete",
    });
  } catch (error) {
    next(error);
  }
};

exports.getClasses = async (req, res, next) => {
  try {
    const db = Db.db;
    let { page, rowsPerPage, sortBy, desc, nameQuery } = req.query;
    console.log(req.query);
    const numPage = parseInt(page);
    const numRowsPerPage = parseInt(rowsPerPage);
    if (nameQuery)
      nameQuery = nameQuery
        .split(" ")
        .reduce((prev, cur) => {
          prev = prev + "+" + cur + " ";
          return prev;
        }, "")
        .match(/^(\+.+)\s$/)[1];

    const fieldCon = nameQuery
      ? [nameQuery, numRowsPerPage, numPage * numRowsPerPage]
      : [numRowsPerPage, numPage * numRowsPerPage];

    const [count] = await db.query(
      `select count(*) total from class ${
        nameQuery && `WHERE match(name) AGAINST(?)`
      }`,
      fieldCon
    );
    console.log(
      `select * from (SELECT class.*, cm.count members from (select * from class ${
        nameQuery && `WHERE match(name) AGAINST(?)`
      } limit ? offset ?) class INNER JOIN (select classId, count(*) count from class_member GROUP by classId) cm ON class.classId = cm.classId) result ${
        sortBy ? "ORDER BY " + sortBy : ""
      }`
    );
    const [classes] = await db.query(
      `select * from (SELECT class.*, cm.count members from (select * from class ${
        nameQuery && `WHERE match(name) AGAINST(?)`
      } limit ? offset ?) class INNER JOIN (select classId, count(*) count from class_member GROUP by classId) cm ON class.classId = cm.classId) result ${
        sortBy ? "ORDER BY " + sortBy : ""
      } ${desc ? " DESC" : ""}`,
      fieldCon
    );
    return res.status(200).json({ total: count[0].total, classList: classes });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.removeClass = async (req, res, next) => {
  try {
    const db = Db.db;
    const { classId } = req.query;
    const [findClass] = await db.query(
      "SELECT * FROM class WHERE classId=?",
      classId
    );
    if (findClass.length === 0)
      return res.status(404).json({ message: "The class is not exist" });
    const { name, owner, school, createAt, avatar } = findClass[0];
    await db.query(
      "INSERT INTO banned_class (classId, name, owner, school, createAt, avatar) VALUES (?)",
      [[classId, name, owner, school, createAt, avatar]]
    );
    await db.query("DELETE FROM class WHERE classId = ?", classId);
    return res.status(201).json({
      message: "The class has been deleted",
    });
  } catch (error) {
    next(error);
  }
};

exports.getClassById = async (req, res, next) => {
  try {
    const db = Db.db;
    const { classId } = req.query;
    const [info] = await db.query(
      "SELECT * FROM class WHERE classId = ?",
      classId
    );
    if (info.length === 0)
      return res.status(404).json({
        message: "Class doesn't exist",
      });
    return res.status(200).json(info[0]);
  } catch (error) {
    next(error);
  }
};

exports.getFullClassInfo = async (req, res, next) => {
  try {
    const db = Db.db;
    const { classId } = req.query;
    const [info] = await db.query(
      "SELECT * FROM class WHERE classId = ?",
      classId
    );
    if (info.length === 0)
      return res.status(404).json({
        message: "Class doesn't exist",
      });
    const [ownerInfo] = await db.query(
      "SELECT * FROM user_info WHERE id = ?",
      info[0].owner
    );
    const [member] = await db.query(
      "SELECT COUNT(*) member FROM class_member WHERE classId = ?",
      classId
    );
    const classInfo = info[0];
    classInfo.member = member[0].member;
    return res.status(200).json({
      classInfo,
      ownerInfo: ownerInfo[0],
    });
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

exports.getClassMember = async (req, res, next) => {
  try {
    const { classId } = req.query;
    const db = Db.db;
    const [memberData] = await db.query(
      "SELECT id,avatar, name FROM user_info WHERE id IN (SELECT userId from class_member WHERE classId = ?)",
      classId
    );
    return res.status(200).json({ memberData });
  } catch (error) {
    next(error);
  }
};

exports.createClass = async (req, res, next) => {
  const { className } = req.body;
  const db = Db.db;
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
      null,
      filePath,
    ]);
    // const [
    //   addToClassMember,
    // ] = await db.query(
    //   `INSERT INTO class_member(classId, userId) VALUES(?,?)`,
    //   [addClass.insertId, ]
    // );
    await db.query(`INSERT INTO message_room(classId) VALUES (?)`, [
      addClass.insertId,
    ]);
    const [
      data,
    ] = await db.query(
      `SELECT * FROM class c INNER JOIN message_room mr ON  c.classId=? AND c.classId=mr.classId`,
      [addClass.insertId]
    );

    return res.status(202).json({ message: "You've created a class" });
    // cacheClasses(data[0]);
  } catch (error) {
    next(error);
  }
};
