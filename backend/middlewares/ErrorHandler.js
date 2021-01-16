const Log = require("../Utils/MakeLog");
const acceptedCodes = [200, 201, 400, 401, 404, 403, 409, 500];
module.exports = (err, req, res, next) => {
  console.log(err);
  // Log.error(err, req);
  res
    .status(err.code || 500)
    .json(
      acceptedCodes.includes(err.code)
        ? err.message
        : "Cannot perform this action!"
    );
};
