const Log = require("../Utils/MakeLog");
module.exports = (err, req, res, next) => {
  Log.error(err, req);
  res.status(err.code || 500).json(err.message);
};
