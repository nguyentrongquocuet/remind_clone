const jwt = require("jsonwebtoken");
const SECRET_KEY = require("../configs/jwt");
const db = require("../Database/db");
const authMiddleware = async (req, res, next) => {
  try {
    const decodedToken = jwt.verify(
      req.headers.authorization.split(" ")[1],
      SECRET_KEY
    );
    const { userId } = decodedToken;
    const [
      user,
    ] = await db.db.query(
      `SELECT * FROM user u INNER JOIN user_info ui ON u.id=? AND u.verified= true`,
      [userId]
    );
    if (user.length < 0) throw new Error("User Not Found");
    req.decodedToken = decodedToken;
    req.userData = user[0];
    next();
  } catch (error) {
    res.status(401).json("invalid token");
  }
};
module.exports = authMiddleware;
