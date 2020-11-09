const jwt = require("jsonwebtoken");
const SECRET_KEY = require("../configs/jwt");

const { validationResult } = require("express-validator");
//login with {email, password}
exports.login = async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  const db = req.app.get("db");
  try {
    const [findUsingEmail] = await db.query(
      `SELECT * FROM user WHERE email=?`,
      [email]
    );
    if (findUsingEmail.length <= 0) {
      return res.status(401).json("Email not found");
    } else if (findUsingEmail[0].password !== password) {
      return res.status(401).json("Wrong password");
    }
    const payload = {
      email,
      password,
      userId: findUsingEmail[0].id,
    };
    console.log(findUsingEmail[0].id);
    const [userInfo] = await db.query(`SELECT * FROM user_info WHERE id=?`, [
      findUsingEmail[0].id,
    ]);

    console.log(userInfo);
    const token = jwt.sign(payload, SECRET_KEY, {
      expiresIn: 3600,
    });
    req.app.get("io").emit("hello", "welcome to remind");
    return res.status(200).json({
      token,
      expiresIn: 3600,
      userData: {
        ...userInfo[0],
      },
    });
  } catch (error) {
    throw error;
  }
};
//SignUp with {email, password, repassword, firstname, lastname}
exports.signup = async (req, res) => {
  console.log(req.body);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password, firstname, lastname } = req.body;
  const db = req.app.get("db");
  try {
    const [
      checkIfEmailExist,
    ] = await db.query(`SELECT * FROM user WHERE email=?`, [email]);

    if (checkIfEmailExist.length > 0) {
      return res.status(401).json("Email has been used");
    }
    const [
      addUser,
    ] = await db.query(`INSERT INTO user (email, password) VALUES (?, ?)`, [
      email,
      password,
    ]);
    const id = addUser.insertId;
    console.log("add to user", addUser);
    const [
      addUserInfo,
    ] = await db.query(
      `INSERT INTO user_info (id,firstName, lastName) VALUES(?,?,?)`,
      [id, firstname, lastname]
    );
    res.status(200).json("SignUp Success");
  } catch (error) {
    throw error;
  }
};
exports.authenticate = async (req, res) => {
  const { email, password } = req.decodedToken;
  const db = req.app.get("db");
  try {
    const [
      user,
    ] = await db.query("SELECT * FROM user WHERE email=? AND password =?", [
      email,
      password,
    ]);
    if (user.length <= 0) return res.status(401).json("Invalid Token");
    const id = user[0].id;
    const [userInfo] = await db.query("SELECT * FROM user_info WHERE id=?", [
      id,
    ]);
    return res.status(200).json(userInfo[0]);
  } catch (error) {
    throw error;
  }
};
