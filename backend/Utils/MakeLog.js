const fs = require("fs").promises;
const path = require("path");
const AnalysisDb = require("../Database/AnalysisDb");
const pretty = require("./JSONPrettier");
const logPath = require("../configs/logPath");
const sqlTime = require("./makeMysqlTime");
class MyLog {
  error(error, request, shouldSaveToDb = true) {
    if (error.stack) {
      return this.makeErrorLog(error, request, shouldSaveToDb);
    } else console.warn("YOU SHOULD LOGS AN INSTANCE OF ERROR!!!");
  }

  // makeTimeStamp(date) {
  //   const hour = date.getUTCHours();
  //   const minute = date.getUTCMinutes();
  //   const second = date.getUTCSeconds();
  //   const day = date.getUTCDate();
  //   const month = date.getUTCMonth() + 1;
  //   const year = date.getUTCFullYear();
  //   return `[${year}-${month}-${day} ${hour}:${
  //     minute > 10 ? minute : "0" + minute
  //   }:${second > 10 ? second : "0" + second}]`;
  // }

  getFrom(obj, ...props) {
    const out = {};
    props.forEach((p) => {
      out[p] = obj[p];
    });
    return out;
  }

  getRequestInfo(request) {
    return pretty(
      JSON.stringify(
        this.getFrom(
          request,
          "headers",
          "hostname",
          "ip",
          "method",
          "path",
          "body",
          "params",
          "query"
        )
      )
    );
  }

  makeErrorLog(error, request, shouldSaveToDb) {
    const date = sqlTime(new Date());
    const code = error.code;
    const stack = error.stack;
    const message = error.message;
    const log = `\n[${date}] Code: ${code || "None"} ${stack}\n RequestInfo:\n${
      request ? this.getRequestInfo(request) : "No request"
    }`;
    return shouldSaveToDb
      ? Promise.all([
          fs.appendFile(path.join(process.cwd(), logPath.error), log, {
            encoding: "utf-8",
          }),
          AnalysisDb.db.query(
            "INSERT INTO errors(code, message, stack, time) VALUES(?)",
            [[code, message, stack, date]]
          ),
        ])
      : fs.appendFile(path.join(process.cwd(), logPath.error), log, {
          encoding: "utf-8",
        });
  }
}

module.exports = new MyLog();
