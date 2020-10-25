const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
    const token = jwt.sign(payload, "hellofrombackend", {
      expiresIn: "1h",
    });
    return res.status(200).json({ token });
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
    if (result.length > 0 && result[0].id) {
      return res.status(200).json("Email has been used");
    }
    try {
      db.query(
        `INSERT INTO user (email, password) VALUES (?, ?)`,
        [email, password],
        (error, result) => {
          const id = result.insertId;
          console.log("add to user", result);
          db.query(
            `INSERT INTO user_info (first_name, last_name,userId) VALUES(?,?,?)`,
            [firstname, lastname, id],
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
