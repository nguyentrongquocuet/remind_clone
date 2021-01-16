const googleOath = require("../Utils/googleOath");

exports.getAllSettings = (req, res, next) => {
  const url = googleOath.getLoginUrl();
  res.status(200).json({ google_login_url: url });
};
