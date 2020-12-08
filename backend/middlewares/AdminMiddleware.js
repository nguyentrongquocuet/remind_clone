const jwt = require("jsonwebtoken");
const SECRET_KEY = require("../configs/jwt");
const db = require("../Database/db");
const adminMiddleware = async (req, res, next) => {
  try {
    const decodedToken = jwt.verify(
      req.headers.authorization.split(" ")[1],
      SECRET_KEY
    );
    const { userId } = decodedToken;
    const [
      user,
    ] = await db.db.query(
      `SELECT * FROM (SELECT * FROM user WHERE id = ?  AND verified = true) u INNER JOIN (SELECT * FROM user_info WHERE id= ? AND role=3) ui ON u.id=ui.id`,
      [userId, userId]
    );
    if (user.length < 0) return res.status(401).json("Invalid token");
    req.decodedToken = decodedToken;
    req.userData = user[0];
    next();
  } catch (error) {
    return res.status(401).json("Invalid token");
  }
};
module.exports = adminMiddleware;
