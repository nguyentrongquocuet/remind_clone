const jwt = require("jsonwebtoken");
const SECRET_KEY = require("../configs/jwt");
const authMiddleware = async (req, res, next) => {
  try {
    const decodedToken = jwt.verify(
      req.headers.authorization.split(" ")[1],
      SECRET_KEY
    );
    console.log(decodedToken);
    req.decodedToken = decodedToken;
    next();
  } catch (error) {
    res.status(401).json("invalid token");
  }
};
module.exports = authMiddleware;
