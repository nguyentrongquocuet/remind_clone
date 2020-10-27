const jwt = require("jsonwebtoken");
const SECRET_KEY = require("../configs/jwt");
const authMiddleware = async (req, res, next) => {
  try {
    const decodedToken = jwt.verify(req.body.token, SECRET_KEY);
    req.decodedToken = decodedToken;
    next();
  } catch (error) {
    res.status(401).json("invalid token");
  }
};
module.exports = authMiddleware;
