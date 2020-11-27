const jwt = require("jsonwebtoken");
const SECRET_KEY = require("../configs/jwt");
const { validationResult } = require("express-validator");
const Db = require("../Database/db");
const transporter = require("../Mailer/Mailer.js");
const OAUTH = require("../Utils/googleOath");
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
      return res.status(404).json("Email not found");
    } else if (findUsingEmail[0].password !== password) {
      return res.status(404).json("Wrong password");
    }
    if (findUsingEmail[0].verified == 0) {
      const code = Math.floor(Math.random() * 10000);
      const mail = {
        from: "daasunnkidd@gmail.com", // Địa chỉ email của người gửi
        to: email, // Địa chỉ email của người gửi
        subject: "Verify your email", // Tiêu đề mail
        text: "Remind", // Nội dung mail dạng text
        html: `<h1>Remind</h1><h2>Code:${code}</h2>`, // Nội dung mail dạng html
      };
      transporter.sendMail(mail, async function (error, info) {
        if (error) {
          // nếu có lỗi
          console.log(error);
        } else {
          //nếu thành công
          // console.log("Email sent: " + info.response);
          console.log("sent mail");
          const [
            updateCode,
          ] = await db.query(`UPDATE USER SET verifyCode= ? WHERE email=?`, [
            code,
            email,
          ]);
          return res.status(401).json("Please Verify Your Email!");
        }
      });
    } else {
      const payload = {
        userId: findUsingEmail[0].id,
      };
      const [userInfo] = await db.query(`SELECT * FROM user_info WHERE id=?`, [
        findUsingEmail[0].id,
      ]);

      const token = jwt.sign(payload, SECRET_KEY, {
        expiresIn: 360000,
      });
      const userData = {
        ...userInfo[0],
        name: `${userInfo[0].firstName} ${userInfo[0].lastName}`,
      };
      return res.status(200).json({
        token,
        expiresIn: 360000,
        userData,
      });
    }
  } catch (error) {
    throw error;
  }
};
//SignUp with {email, password, repassword, firstname, lastname}
exports.signupPrepare = async (req, res) => {
  const db = Db.db;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password, firstname, lastname, birthday, gender } = req.body;

  try {
    const [
      checkIfEmailExist,
    ] = await db.query(`SELECT * FROM user WHERE email=?`, [email]);

    if (checkIfEmailExist.length > 0) {
      // console.log(checkIfEmailExist);
      // handle forgot password
      return res.status(401).json("Email has been used");
    }
    const code = Math.floor(Math.random() * 10000);
    const mail = {
      from: "daasunnkidd@gmail.com", // Địa chỉ email của người gửi
      to: email, // Địa chỉ email của người gửi
      subject: "Verify your email", // Tiêu đề mail
      text: "Remind", // Nội dung mail dạng text
      html: `<h1>Remind</h1><h2>Code:${code}</h2>`, // Nội dung mail dạng html
    };
    console.log("sent mail");
    //Tiến hành gửi email
    transporter.sendMail(mail, async function (error, info) {
      if (error) {
        // nếu có lỗi
        console.log(error);
      } else {
        //nếu thành công
        // console.log("Email sent: " + info.response);
        const [
          addUser,
        ] = await db.query(
          `INSERT INTO user (email, password, verifyCode) VALUES (?, ?,?)`,
          [email, password, code]
        );
        const id = addUser.insertId;
        const [
          addUserInfo,
        ] = await db.query(
          `INSERT INTO user_info (id,firstName, lastName,birthday,gender ) VALUES(?,?,?,?,?)`,
          [id, firstname, lastname, birthday, gender]
        );
        return res.status(200).json("Email sent");
      }
    });
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

exports.confirmEmail = async (req, res) => {
  const db = Db.db;
  const { email, code } = req.body;
  console.log(req.body);
  if (!code || code.length <= 0) return res.status(404).json("Wrong code!");
  try {
    const [
      confirmed,
    ] = await db.query("SELECT * FROM user WHERE email=? AND verifyCode = ?", [
      email,
      code,
    ]);
    if (confirmed.length <= 0) return res.status(404).json("Wrong code!");
    await db.query("UPDATE user SET verified=true WHERE id=?", confirmed[0].id);
    res.status(200).json("oke");
  } catch (error) {
    res.status(500).json("SERVER ERROR");
    throw error;
  }
};

exports.resetPassword = async (req, res) => {
  console.log("resetPassword");
  const { email } = req.body;
  console.log(req.body);
  const db = Db.db;
  try {
    const [findUsingEmail] = await db.query(
      `SELECT * FROM user WHERE email=?`,
      [email]
    );
    if (findUsingEmail.length <= 0) {
      return res.status(404).json("Email not found");
    }
    const code = Math.floor(Math.random() * 10000);
    const mail = {
      from: "daasunnkidd@gmail.com", // Địa chỉ email của người gửi
      to: email, // Địa chỉ email của người gửi
      subject: "Reset Password", // Tiêu đề mail
      text: "Remind", // Nội dung mail dạng text
      html: `<h1>Remind</h1><h2>Code:${code}</h2>`, // Nội dung mail dạng html
    };
    transporter.sendMail(mail, async function (error, info) {
      if (error) {
        // nếu có lỗi
        console.log(error);
      } else {
        //nếu thành công
        // console.log("Email sent: " + info.response);
        console.log("sent mail");
        const password_token = jwt.sign(
          {
            email: email,
          },
          SECRET_KEY,
          {
            expiresIn: 60,
          }
        );
        const [
          updateCode,
        ] = await db.query(`UPDATE USER SET verifyCode= ? WHERE email=?`, [
          code,
          email,
        ]);
        return res.status(200).json({
          token: password_token,
          expiresIn: 60,
        });
      }
    });
  } catch (error) {
    res.status(500).json("server error");
    throw error;
  }
};

exports.confirmPasswordCode = async (req, res) => {
  const db = Db.db;
  const { email, code, token } = req.body;
  console.log(req.body);
  if (!code || code.length <= 0) return res.status(404).json("Wrong code!");
  try {
    const decodedToken = jwt.verify(token, SECRET_KEY);
    if (decodedToken.email != email) return res.status(404).json("Wrong code!");
    const [
      confirmed,
    ] = await db.query("SELECT * FROM user WHERE email=? AND verifyCode = ?", [
      email,
      code,
    ]);
    if (confirmed.length <= 0) return res.status(404).json("Wrong code!");
    const newToken = jwt.sign(
      {
        email: email,
      },
      SECRET_KEY,
      {
        expiresIn: 60,
      }
    );
    res.status(200).json({
      token: newToken,
      expiresIn: 60,
    });
  } catch (error) {
    res.status(500).json("Invalid authentication credentials!");
    throw error;
  }
};

exports.changePasswordWithoutLogin = async (req, res) => {
  const db = Db.db;
  const { email, password, repassword, token } = req.body;
  console.log(req.body);
  if (password != repassword)
    return res.status(404).json("Two passwords not match!");
  try {
    const decodedToken = jwt.verify(token, SECRET_KEY);
    if (decodedToken.email != email)
      return res.status(404).json("Invalid authentication credentials!");
    const [searchUser] = await db.query(
      "SELECT * FROM user WHERE email = ?",
      email
    );
    if (searchUser.length <= 0)
      return res.status(404).json("User is no longer available!");
    await db.query("UPDATE user SET password = ? WHERE id = ?", [
      password,
      searchUser[0].id,
    ]);
    res.status(200).json("oke");
  } catch (error) {
    res.status(500).json("SERVER ERROR");
    throw error;
  }
};

exports.googleAuth = async (req, res) => {
  const { code } = req.body;
  const db = Db.db;
  try {
    const { tokens } = await OAUTH.client.getToken(code);
    OAUTH.client.setCredentials(tokens);
    console.log(tokens);
    const vt = await OAUTH.client.verifyIdToken({
      idToken: tokens.id_token,
    });
    let finalId;
    if (vt.getPayload().email_verified) {
      const [searchUser] = await db.query(
        "SELECT * FROM user WHERE email = ?",
        vt.getPayload().email
      );
      finalId = searchUser[0].id;
      console.log(searchUser);
      if (searchUser.length <= 0) {
        //signup
        const userData = await OAUTH.peopleApi.get({
          resourceName: `people/${vt.getUserId()}`,
          personFields: "birthdays,genders",
          auth: OAUTH.client,
        });
        const firstName = vt.getPayload().family_name;
        const lastName = vt.getPayload().given_name;
        const avatar = vt.getPayload().picture;
        const birthday = Object.values(userData.data.birthdays[0].date)
          .reduce((prev, cur) => {
            return prev.concat(cur, "/");
          }, "")
          .split(/\/$/)[0];
        const gender = userData.data.genders[0].formattedValue;
        const [newUser] = await db.query(
          "INSERT INTO user(email,verified) VALUES(?,1)",
          vt.getPayload().email
        );
        finalId = newUser.insertId;
        await db.query(
          "INSERT INTO user_info(id,firstName, lastName, dateOfBirth, gender, avatar) VALUES(?,?,?,?,?,?)",
          [newUser.insertId, firstName, lastName, birthday, gender, avatar]
        );
        console.log(vt.getPayload());
        // res.status(201).json({
        //   message: "Now you can login using Google Account",
        // });
      }
      //login
      const [userInfo] = await db.query(`SELECT * FROM user_info WHERE id=?`, [
        finalId,
      ]);
      const payload = {
        userId: finalId,
      };
      const token = jwt.sign(payload, SECRET_KEY, {
        expiresIn: 360000,
      });
      const userData = {
        ...userInfo[0],
        name: `${userInfo[0].firstName} ${userInfo[0].lastName}`,
      };
      return res.status(200).json({
        token,
        expiresIn: 360000,
        userData,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json("invalid credentials");
  }
};
