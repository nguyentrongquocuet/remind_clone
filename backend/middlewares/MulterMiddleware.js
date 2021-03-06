const multer = require("multer");
const AnalysisDb = require("../Database/AnalysisDb");
const MIMETYPE = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/svg+xml": "svg",
};
const storage = new multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(file.mimetype);
    // let err = MIMETYPE[file.mimetype] ? null : new Error("invalid mimetype");
    cb(null, "backend/public/images");
  },
  filename: (req, file, cb) => {
    const type = MIMETYPE[file.mimetype];
    // let err = type ? null : new Error("invalid mimetype");
    const [ogName, ogExt] = file.originalname
      .split(" ")
      .join("-")
      .split(/(.\w+)$/g)
      .filter((e) => e);
    const name = ogName + "-" + Date.now() + ogExt;
    cb(null, name);
    AnalysisDb.db.query("UPDATE analysis SET amount=amount+1 WHERE id = 5");
  },
});
module.exports = multer({ storage: storage });
