const jwt = require("jsonwebtoken");
const SECRET_KEY = require("../configs/jwt");
const { validationResult } = require("express-validator");
const Db = require("../Database/db");
//login with {email, password}
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const db = Db.db;
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
      userId: findUsingEmail[0].id,
    };
    const [userInfo] = await db.query(`SELECT * FROM user_info WHERE id=?`, [
      findUsingEmail[0].id,
    ]);

    const token = jwt.sign(payload, SECRET_KEY, {
      expiresIn: 3600,
    });
    const userData = {
      ...userInfo[0],
      name: `${userInfo[0].firstName} ${userInfo[0].lastName}`,
    };
    return res.status(200).json({
      token,
      expiresIn: 3600,
      userData,
    });
  } catch (error) {
    throw error;
  }
};
//SignUp with {email, password, repassword, firstname, lastname}
exports.signup = async (req, res) => {
  const db = Db.db;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password, firstname, lastname } = req.body;

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

exports.setRole = async (req, res) => {
  const { userId } = req.decodedToken;
  const { roleId } = req.body;
  const db = Db.db;
  try {
    const [role] = await db.query(`SELECT role FROM user_info WHERE id = ?`, [
      userId,
    ]);
    if (role.length < 0 || role[0].role !== null) {
      throw new Error("Setting role is not available");
    }
    await db.query(`UPDATE user_info SET role = ? WHERE id=?`, [
      roleId,
      userId,
    ]);
    const [newRole] = await db.query(
      `SELECT role FROM user_info where id = ?`,
      [userId]
    );
    setTimeout(() => {
      res.status(200).json(newRole[0]);
    }, 3000);
  } catch (error) {
    res.status(404).json("Something went wrong!!!");
    throw error;
  }
};

exports.authenticate = async (req, res) => {
  const { userId } = req.decodedToken;
  const db = Db.db;
  try {
    const [user] = await db.query("SELECT * FROM user WHERE id=?", [userId]);
    if (user.length <= 0) return res.status(401).json("Invalid Token");
    const id = user[0].id;
    const [userInfo] = await db.query("SELECT * FROM user_info WHERE id=?", [
      id,
    ]);
    const userData = {
      ...userInfo[0],
      name: `${userInfo[0].firstName} ${userInfo[0].lastName}`,
    };
    return res.status(200).json(userData);
  } catch (error) {
    throw error;
  }
};
