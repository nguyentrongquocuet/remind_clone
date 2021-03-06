const sql = require("mysql2");
class AnalysisDB {
  init = () => {
    try {
      const db = sql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.ANALYSIS_DB_NAME,
        port: process.env.DB_PORT,
        timezone: "+00:00",
      });
      db.connect((err, ...rest) => {
        if (err) {
          throw err;
        }
        console.log("ANALYSIS DATABASE IS FINE");
      });

      this.db = db.promise();
    } catch (error) {
      throw error;
    }
  };
}

module.exports = new AnalysisDB();
