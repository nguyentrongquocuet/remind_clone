const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const SECRET_KEY = require("../configs/jwt");

const { validationResult } = require("express-validator");
//login with {email, password}
exports.login = (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  const db = req.app.get("db");
  db.query(`SELECT * FROM user WHERE email=?`, [email], (error, result) => {
    console.log(result);
    if (error) {
      throw error;
    }
    if (result.length <= 0) {
      return res.status(401).json("Email not found");
    } else if (result[0].password !== password) {
      return res.status(401).json("Wrong password");
    }
    const payload = {
      email,
      password,
    };
    db.query(
      `SELECT * FROM user_info WHERE id=?`,
      [result[0].id],
      (error, result) => {
        if (error) {
          throw error;
        }
        console.log(result);
        const token = jwt.sign(payload, SECRET_KEY, {
          expiresIn: 3600,
        });
        return res.status(200).json({
          token,
          expiresIn: 3600,
          userData: {
            ...result[0],
          },
        });
      }
    );
  });
};
//SignUp with {email, password, repassword, firstname, lastname}
exports.signup = (req, res) => {
  console.log(req.body);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password, firstname, lastname } = req.body;
  const db = req.app.get("db");

  db.query(`SELECT * FROM user WHERE email=?`, [email], (error, result) => {
    console.log(result, result.length);
    if (error) {
      throw error;
    }
    if (result.length > 0) {
      return res.status(401).json("Email has been used");
    }
    try {
      db.query(
        `INSERT INTO user (email, password) VALUES (?, ?)`,
        [email, password],
        (error, result) => {
          const id = result.insertId;
          console.log("add to user", result);
          db.query(
            `INSERT INTO user_info (id,first_name, last_name) VALUES(?,?,?)`,
            [id, firstname, lastname],
            (error, result) => {
              console.log("add to user_info", result);
              res.status(200).json("SignUp Success");
            }
          );
        }
      );
    } catch (error) {
      throw error;
    }
  });
};
exports.authenticate = async (req, res) => {
  const { email, password } = req.decodedToken;
  const db = req.app.get("db");
  db.query(
    "SELECT * FROM user WHERE email=? AND password =?",
    [email, password],
    (error, result) => {
      if (error) return res.status(500).json("Server error");
      if (result.length <= 0) return res.status(401).json("Invalid Token");
      const id = result[0].id;
      db.query("SELECT * FROM user_info WHERE id=?", [id], (error, result) => {
        if (error) return res.status(500).json("Server error");
        console.log(result[0]);
        return res.status(200).json(result[0]);
      });
    }
  );
};
