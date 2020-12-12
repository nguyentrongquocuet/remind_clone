const AnalysisDb = require("../Database/AnalysisDb");

exports.request = async (req, res, next) => {
  if (req.method !== "OPTIONS")
    await AnalysisDb.db.query(
      "UPDATE analysis SET amount = amount+1 WHERE id=1"
    );
  next();
};

exports.file = async (req, res, next) => {
  if (req.method !== "OPTIONS")
    await AnalysisDb.db.query(
      "UPDATE analysis SET amount = amount+1 WHERE id=4"
    );
  next();
};
