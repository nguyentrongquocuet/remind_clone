const Db = require("../Database/db");
const SystemError = require("../models/Error");
const googleOath = require("../Utils/googleOath");

exports.getDriveFiles = async (req, res, next) => {
  try {
    const db = Db.db;
    const userId = req.decodedToken.userId;
    const { amount, nextPageToken, namequery } = req.query;
    console.log(req.query);
    const [ggTokens] = await db.query(
      "SELECT * FROM user_credentials WHERE id = ?",
      userId
    );
    const gdRT = ggTokens[0].gdRefreshToken;
    const q = namequery ? `name='${namequery}'` : null;
    if (gdRT) {
      googleOath.client.setCredentials({ refresh_token: gdRT });
      // const access_token = googleOath.client.getAccessToken();
      const listfile = await googleOath.drive.files.list({
        pageSize: amount || 20,
        orderBy: "modifiedTime",
        pageToken: nextPageToken,
        q,
        fields:
          "kind, nextPageToken, incompleteSearch, files(id, name,iconLink,webViewLink, mimeType, modifiedTime,hasThumbnail,thumbnailLink)",
      });
      return res.status(200).json({
        ...listfile.data,
      });
    } else
      throw new SystemError(
        403,
        "Cant find credentials you must use google account to perform this action!"
      );
  } catch (error) {
    next(error);
  }
};

exports.getClassrooms = async (req, res, next) => {
  try {
    const db = Db.db;
    const userId = req.decodedToken.userId;
    const { amount, nextPageToken } = req.query;
    console.log(req.query);
    const [ggTokens] = await db.query(
      "SELECT * FROM user_credentials WHERE id = ?",
      userId
    );
    const gcRT = ggTokens[0].gcRefreshToken;
    if (gcRT) {
      googleOath.client.setCredentials({
        refresh_token: gcRT,
      });
      const listCourse = await googleOath.classrom.courses.list({
        pageSize: amount || 20,
        pageToken: nextPageToken,
        teacherId: "me",
      });
      console.log(listCourse.data);
      const handledListcourse = { ...listCourse.data };
      handledListcourse.courses = listCourse.data.courses.map((course) => {
        return {
          ...course,
          inviteLink: `${course.alternateLink}?cjc=${course.enrollmentCode}`,
        };
      });
      return res.status(200).json({ ...handledListcourse });
    } else
      throw new SystemError(
        403,
        "Cant find credentials you must use google account to perform this action!"
      );
  } catch (error) {
    next(error);
  }
};
