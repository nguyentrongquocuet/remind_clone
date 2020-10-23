const app = require("./backend/app");
const port = 5000;
app.set("port", port);

const sever = require("http").createServer(app);
sever.listen(port);
