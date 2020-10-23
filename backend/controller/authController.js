const jwt = require("jsonwebtoken");
exports.login = (req, res) => {
  console.log(req.body);
  if (req.body.email === "q@q.q" && req.body.password === "123456") {
    const payload = {
      username: "q@q.q",
      password: "123456",
    };
    const token = jwt.sign(payload, "hellofrombackend", {
      expiresIn: "1h",
    });
    return res.status(200).json({
      token,
    });
  }
  res.status(401).json("failed");
};

exports.signup = (req, res) => {
  res.status(200).json("signup working");
};
