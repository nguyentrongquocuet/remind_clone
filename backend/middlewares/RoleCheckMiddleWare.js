const Db = require("../Database/db");
const SystemError = require("../models/Error");

const ROLE = {
  0: "teacher",
  1: "student",
  2: "parent",
  parent: 2,
  student: 1,
  teacher: 0,
};

const roleCheck = (...role) => {
  return async (req, res, next) => {
    const db = Db.db;
    const userId = req.decodedToken.userId;
    const [getRole] = await db.query(
      "SELECT * FROM user_info where id=?",
      userId
    );
    if (getRole.length <= 0) {
      return next(new SystemError(404, "Unknown user"));
    }
    if (role.includes(ROLE[getRole[0].role])) return next();
    else
      return next(
        new SystemError(
          403,
          `You must be a ${role.join(" or ")} to perform this action!`
        )
      );
  };
};

module.exports = roleCheck;
