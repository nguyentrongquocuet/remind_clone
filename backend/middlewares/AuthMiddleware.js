const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res) => {
  try {
    jwt.verify(req.body.token);
    res.status(200).json("authenticated");
  } catch (error) {}
};
module.exports = authMiddleware;
