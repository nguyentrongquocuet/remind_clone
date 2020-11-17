const jwt = require("jsonwebtoken");
const SECRET_KEY = require("../configs/jwt");
const authMiddleware = async (req, res, next) => {
  const db = req.app.get("db");
  try {
    const decodedToken = jwt.verify(
      req.headers.authorization.split(" ")[1],
      SECRET_KEY
    );
    const { userId } = decodedToken;
    console.log({ userId: userId });
    const [user] = await db.query(`SELECT * FROM user where id = ?`, [userId]);
    if (user.length < 0) throw new Error("User Not Found");
    req.decodedToken = decodedToken;
    next();
  } catch (error) {
    res.status(401).json("invalid token");
  }
};
module.exports = authMiddleware;
