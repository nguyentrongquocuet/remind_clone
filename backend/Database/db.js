const sql = require("mysql");
let db;
exports.init = () => {
  db = sql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  db.connect((err, ...rest) => {
    if (err) {
      return err;
    }
    console.log("DATABASE IS FINE");
  });
  return db;
};

exports.db = db;
