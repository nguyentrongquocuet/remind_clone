const { google } = require("googleapis");
class OAUTH {
  init = () => {
    this.client = new google.auth.OAuth2(
      process.env.GG_CLIENT_ID,
      process.env.GG_CLIENT_SECRET,
      process.env.GG_REDIRECT_URL
    );
    this.peopleApi = new google.people({
      version: "v1",
      auth: "AIzaSyCH0sw3-CHEEAj5YyofBBIemwcgyjzVQD8",
    }).people;
    this.client.on("tokens", (tokens) => {
      console.log(tokens);
    });
  };
}
// generate a url that asks permissions for Blogger and Google Calendar scopes

module.exports = new OAUTH();
