exports.getClass = (req, res) => {
  const userId = req.decodedToken.userId;
  const db = req.app.get("db");
  db.query(
    `SELECT * FROM class_member cm INNER JOIN class c ON  cm.userId =?
    AND cm.classId=c.classId`,
    [userId],
    (error, result) => {
      if (error) throw error;
      res.status(200).json(result);
    }
  );
};

exports.findClass = (req, res) => {
  console.log("QUERY", req.query);
  let { query, notJoined } = req.query;
  const userId = req.decodedToken.userId;
  const db = req.app.get("db");
  let nameMode = true;
  if (query[0] === "@") {
    query = query.split("@").filter((e) => e)[0];
    nameMode = false;
    query = "%" + query + "%";
  } else {
    query = query
      .split(" ")
      .reduce((prev, cur) => {
        prev = prev + "+" + cur + " ";
        return prev;
      }, "")
      .match(/^(\+.+)\s$/)[1];
  }
  db.query(
    `SELECT * FROM class WHERE ${
      nameMode ? "MATCH(name) AGAINST(?)" : "classId LIKE ?"
    } ${
      notJoined === "true"
        ? "AND classId NOT IN (SELECT classId from class_member WHERE userId = ?)"
        : ""
    }`,
    [query, userId],
    (error, result) => {
      if (error) throw error;
      console.log(result);
      return res.status(200).json(result);
    }
  );

  // if (query) return res.status(200).json(query);
  // return res.status(401).json("dad");
};

exports.getMembers = (req, res) => {
  const db = req.app.get("db");
  let classId = req.query.classId;
  if (isNaN(classId)) classId = -1;
  db.query(
    `SELECT * FROM class_member cm INNER JOIN user_info ui ON cm.userId = ui.id WHERE classId=?`,
    [classId],
    (error, result) => {
      if (error) throw error;
      res.status(200).json(result);
    }
  );
};

exports.dummy = (req, res) => {
  const db = req.app.get("db");
  const a = db.query(`SELECT * FROM class_member`);
  console.log(a);
  res.send(a);
};
