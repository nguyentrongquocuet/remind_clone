const { google } = require("googleapis");
const driveApi = require("./driveApi");
const fs = require("fs");
const path = require("path");

const SCOPES = [
  "https://www.googleapis.com/auth/classroom.courses",
  "https://www.googleapis.com/auth/classroom.rosters",
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/user.gender.read",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/user.birthday.read",
  "openid",
];
class OAUTH {
  init = () => {
    this.client = new google.auth.OAuth2(
      process.env.GG_CLIENT_ID,
      process.env.GG_CLIENT_SECRET,
      process.env.GG_REDIRECT_URL
    );
    this.peopleApi = google.people({
      version: "v1",
      auth: "AIzaSyCH0sw3-CHEEAj5YyofBBIemwcgyjzVQD8",
    }).people;
    this.client.on("tokens", (tokens) => {
      console.log(tokens);
    });
    this.drive = google.drive({
      version: "v3",
      auth: this.client,
    });
    // driveApi.init(this.client);
    // this.ownDrive = driveApi;
    this.classrom = google.classroom({
      version: "v1",
      auth: this.client,
    });
  };
  getLoginUrl = () => {
    return this.client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
    });
  };
}
// generate a url that asks permissions for Blogger and Google Calendar scopes

module.exports = new OAUTH();
