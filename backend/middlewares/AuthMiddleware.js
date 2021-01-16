const jwt = require("jsonwebtoken");
const SECRET_KEY = require("../configs/jwt");
// const Redis = require("../configs/Redis");
const AnalysisDb = require("../Database/AnalysisDb");
// const db = require("../Database/db");
const SystemError = require("../models/Error");
const authMiddleware = async (req, res, next) => {
  try {
    const decodedToken = jwt.verify(
      req.headers.authorization.split(" ")[1],
      SECRET_KEY
    );
    console.log(decodedToken);
    await AnalysisDb.db.query(
      "UPDATE analysis SET amount = amount+1 WHERE id=3"
    );

    // const { userId } = decodedToken;
    // const rawUserData = await Redis.getAsync(`user-${userId}`);
    // req.userData = JSON.parse(rawUserData);
    req.decodedToken = decodedToken;
    next();
  } catch (error) {
    next(new SystemError(401, "Invalid token"));
  }
};
module.exports = authMiddleware;
