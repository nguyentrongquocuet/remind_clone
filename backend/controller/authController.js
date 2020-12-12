const jwt = require("jsonwebtoken");
const SECRET_KEY = require("../configs/jwt");
const { validationResult } = require("express-validator");
const Db = require("../Database/db");
const transporter = require("../Mailer/Mailer.js");
const OAUTH = require("../Utils/googleOath");
const Redis = require("../configs/Redis");
const SystemError = require("../models/Error");
//login with {email, password}
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  const db = Db.db;
  try {
    const [findUsingEmail] = await db.query(
      `SELECT * FROM user WHERE email=?`,
      [email]
    );
    if (findUsingEmail.length <= 0 || findUsingEmail[0].password !== password) {
      throw new SystemError(404, "Wrong email or password!!!");
    }
    if (findUsingEmail[0].verified == 0) {
      const code = Math.floor(Math.random() * 10000);
      const mail = {
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
          throw new SystemError(401, "Please Verify Your Email!");
        }
      });
    } else {
      const payload = {
        userId: findUsingEmail[0].id,
      };
      const [userInfo] = await db.query(`SELECT * FROM user_info WHERE id=?`, [
        findUsingEmail[0].id,
      ]);
      const [children] = await db.query(
        `SELECT * FROM relationship r INNER JOIN user_info ui ON r.parentId=? AND r.childId=ui.id`,
        findUsingEmail[0].id
      );
      console.log(children);
      const token = jwt.sign(payload, SECRET_KEY, {
        expiresIn: 360000,
      });
      const userData = {
        ...userInfo[0],
        name: `${userInfo[0].firstName} ${userInfo[0].lastName}`,
        children: [...children],
      };
      return res.status(200).json({
        token,
        expiresIn: 360000,
        userData,
      });
    }
  } catch (error) {
    return next(error);
  }
};
//SignUp with {email, password, repassword, firstname, lastname}
exports.signupPrepare = async (req, res, next) => {
  const db = Db.db;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new SystemError(400, JSON.stringify(errors.array()));
  }
  const { email, password, firstname, lastname, birthday, gender } = req.body;

  try {
    const [
      checkIfEmailExist,
    ] = await db.query(`SELECT * FROM user WHERE email=?`, [email]);

    if (checkIfEmailExist.length > 0) {
      // console.log(checkIfEmailExist);
      // handle forgot password
      throw new SystemError(401, "Email has been used");
    }
    const code = Math.floor(Math.random() * 10000);
    const mail = {
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
    return next(error);
  }
};

exports.setRole = async (req, res, next) => {
  const { userId } = req.decodedToken;
  const { roleId } = req.body;
  const db = Db.db;
  try {
    const [role] = await db.query(`SELECT role FROM user_info WHERE id = ?`, [
      userId,
    ]);
    if (role.length < 0 || role[0].role !== null) {
      throw new SystemError(404, "Setting role is not available");
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
    next(error);
  }
};

exports.authenticate = async (req, res, next) => {
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
    next(error);
  }
};

exports.confirmEmail = async (req, res, next) => {
  const db = Db.db;
  const { email, code } = req.body;
  console.log(req.body);
  if (!code || code.length <= 0) throw new SystemError(401, "Wrong code!!!");
  try {
    const [
      confirmed,
    ] = await db.query("SELECT * FROM user WHERE email=? AND verifyCode = ?", [
      email,
      code,
    ]);
    if (confirmed.length <= 0) throw new SystemError(401, "Wrong code!!!");
    await db.query("UPDATE user SET verified=true WHERE id=?", confirmed[0].id);
    res.status(200).json("oke");
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  console.log("resetPassword");
  const { email } = req.body;
  console.log(req.body);
  const db = Db.db;
  try {
    const [findUsingEmail] = await db.query(
      `SELECT * FROM user WHERE email=?`,
      [email]
    );
    if (findUsingEmail.length <= 0)
      throw new SystemError(404, "Email not found!!!");
    const code = Math.floor(Math.random() * 10000);
    const mail = {
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
    next(error);
  }
};

exports.confirmPasswordCode = async (req, res, next) => {
  const db = Db.db;
  const { email, code, token } = req.body;
  console.log(req.body);
  if (!code || code.length <= 0) throw new SystemError(401, "Wrong code!!!");
  try {
    const decodedToken = jwt.verify(token, SECRET_KEY);
    if (decodedToken.email != email)
      throw new SystemError(401, "Wrong code!!!");
    const [
      confirmed,
    ] = await db.query("SELECT * FROM user WHERE email=? AND verifyCode = ?", [
      email,
      code,
    ]);
    if (confirmed.length <= 0) throw new SystemError(401, "Wrong code!!!");
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
    next(error);
  }
};

exports.changePasswordWithoutLogin = async (req, res, next) => {
  const db = Db.db;
  const { email, password, repassword, token } = req.body;
  console.log(req.body);
  if (password != repassword)
    throw new SystemError(401, "Two passwords not match!");
  try {
    const decodedToken = jwt.verify(token, SECRET_KEY);
    if (decodedToken.email != email)
      throw new SystemError(401, "Invalid authentication credentials!");
    const [searchUser] = await db.query(
      "SELECT * FROM user WHERE email = ?",
      email
    );
    if (searchUser.length <= 0)
      throw new SystemError(404, "User is no longer available!");
    await db.query("UPDATE user SET password = ? WHERE id = ?", [
      password,
      searchUser[0].id,
    ]);
    res.status(200).json("oke");
  } catch (error) {
    next(error);
  }
};

exports.googleAuth = async (req, res, next) => {
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
        const [
          newUser,
        ] = await db.query(
          "INSERT INTO user(email,verified, refresh_token) VALUES(?,1,?)",
          [vt.getPayload().email, tokens.refresh_token]
        );
        finalId = newUser.insertId;
        await db.query(
          "INSERT INTO user_info(id,firstName, lastName, birthday, gender, avatar) VALUES(?,?,?,?,?,?)",
          [newUser.insertId, firstName, lastName, birthday, gender, avatar]
        );
        console.log(vt.getPayload());
        // res.status(201).json({
        //   message: "Now you can login using Google Account",
        // });
      } else {
        finalId = searchUser[0].id;
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
    next(new SystemError(401, "Invalid credentials"));
  }
};

exports.getConnectChildUrl = async (req, res, next) => {
  const userId = req.decodedToken.userId;
  const token = jwt.sign(
    {
      parentId: userId,
    },
    SECRET_KEY
  );
  const url = `${process.env.CLIENT_URL}/connect?token=${token}`;
  res.status(200).json({
    url: url,
  });
};

exports.connectChild = async (req, res, next) => {
  const userId = req.decodedToken.userId;
  const { connectToken } = req.body;
  const db = Db.db;
  try {
    const { parentId } = jwt.verify(connectToken, SECRET_KEY);
    const [
      connect,
    ] = await db.query(
      "INSERT INTO relationship(parentId, childId) VALUES(?,?)",
      [parentId, userId]
    );
    console.log(parentId, userId);
    res.status(200).json("You and your parent are connected");
  } catch (error) {
    if (error.errno === 1062) {
      return next(
        new SystemError(
          409,
          "Two people are already connected, no need to reconnect!"
        )
      );
    }
    return next(
      new SystemError(404, "The url is incorrect or has been modified")
    );
  }
};

exports.getUserInfo = async (req, res, next) => {
  const { userId } = req.query;
  console.log(req.query);
  const db = Db.db;
  try {
    const [userInfo] = await db.query(
      "SELECT * FROM user_info WHERE id = ?",
      userId
    );
    if (userInfo.length <= 0) {
      throw new SystemError(404, "User not found!");
    }
    return res.status(200).json(userInfo[0]);
  } catch (error) {
    next(error);
  }
};
