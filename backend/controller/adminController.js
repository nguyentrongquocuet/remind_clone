const Db = require("../Database/db");
const AnalysisDb = require("../Database/AnalysisDb");
exports.getUserAmount = async (req, res) => {
  const db = Db.db;

  const [amount] = await db.query("SELECT COUNT(*) amount FROM user");
  console.log(amount[0]);
  res.status(200).json({ ...amount[0], lastUpdate: new Date() });
};

exports.getClassAmount = async (req, res) => {
  const db = Db.db;
  const [amount] = await db.query("SELECT COUNT(*) amount FROM class");
  console.log(amount[0]);
  res.status(200).json({ ...amount[0], lastUpdate: new Date() });
};

exports.getRequestAmount = async (req, res) => {
  const [requestAmountInfo] = await AnalysisDb.db.query(
    "SELECT * FROM analysis WHERE name LIKE '%request%'"
  );
  const finalOutput = requestAmountInfo.reduce((out, reqType) => {
    out[reqType.name] = reqType;
    return out;
  }, {});
  res.status(200).json(finalOutput);
};

exports.getVisitorAmount = async (req, res) => {
  const [visitorAmount] = await AnalysisDb.db.query(
    "SELECT * FROM analysis WHERE name='visitors'"
  );
  res.status(200).json(visitorAmount[0]);
};

exports.getUsers = async (req, res) => {
  const db = Db.db;
  const [user] = await db.query("SELECT * FROM user");
  res.status(200).json(user);
};
