const db = require("../Database/db");

exports.request = async (req, res, next) => {
  await db.db.query("UPDATE analysis SET amount = amount+1 WHERE id=1");
  next();
};

exports.file = async (req, res, next) => {
  await db.db.query("UPDATE analysis SET amount = amount+1 WHERE id=4");
  next();
};
