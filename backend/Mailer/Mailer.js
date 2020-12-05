const nodemailer = require("nodemailer");

const option = {
  service: "gmail",
  auth: {
    user: "daasunnkidd@gmail.com", // email hoặc username
    pass: "nguyentrongquoc", // password
  },
};
const transporter = nodemailer.createTransport(option, {
  from: "Remind_clone <no-reply@remindclone.com>",
});
transporter.verify(function (error, success) {
  // Nếu có lỗi.
  if (error) {
    console.log(error);
  } else {
    //Nếu thành công.
    console.log("Kết nối thành công!");
  }
});

module.exports = transporter;
