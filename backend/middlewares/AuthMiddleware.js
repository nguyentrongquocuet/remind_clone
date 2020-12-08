const jwt = require("jsonwebtoken");
const SECRET_KEY = require("../configs/jwt");
const Redis = require("../configs/Redis");
const db = require("../Database/db");
const authMiddleware = async (req, res, next) => {
  try {
    const decodedToken = jwt.verify(
      req.headers.authorization.split(" ")[1],
      SECRET_KEY
    );
    await db.db.query("UPDATE analysis SET amount = amount+1 WHERE id=3");

    const { userId } = decodedToken;
    const rawUserData = await Redis.getAsync(`user-${userId}`);
    req.userData = JSON.parse(rawUserData);
    req.decodedToken = decodedToken;
    next();
  } catch (error) {
    res.status(401).json("invalid token");
    console.log(error);
  }
};
module.exports = authMiddleware;
