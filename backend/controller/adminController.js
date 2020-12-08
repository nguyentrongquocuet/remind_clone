const Db = require("../Database/db");

exports.getUserAmount = async (req, res) => {
  const db = Db.db;

  const [amount] = await db.query("SELECT COUNT(*) amount FROM user");
  console.log(amount[0]);
  res.status(200).json(amount[0]);
};

exports.getClassAmount = async (req, res) => {
  const db = Db.db;
  const [amount] = await db.query("SELECT COUNT(*) amount FROM class");
  console.log(amount[0]);
  res.status(200).json(amount[0]);
};

exports.getRequestAmount = async (req, res) => {
  const db = Db.db;
  // const [requestAmountInfo] = await db.query("SELECT * FROM ")
};
