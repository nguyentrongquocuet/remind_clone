import BaseService from "./BaseService";
export class ClassService {
  static getClass = () => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) return new Error("Something went wrong!!!");

    return BaseService.get(`class`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };
  static joinClass = (classId) => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token || !classId) return new Error("Something went wrong!!!");
    return BaseService.post(
      `class/join`,
      { classId: classId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  };
  static leaveClass = (classId) => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token || !classId) return new Error("Something went wrong!!!");
    return BaseService.delete("class/leave", {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        classId: classId,
      },
    });
  };
  static findClass = (query, notJoined) => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token || !query) return new Error("Something went wrong!!!");

    return BaseService.get(`class/find`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        query: query,
        notJoined: Boolean(notJoined),
      },
    });
  };
  static getClassMembers = (classId) => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token || !classId) return new Error("Something went wrong!!!");
    return BaseService.get(`class/member`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        classId: classId,
      },
    });
  };

  static createClass = (classInfo) => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) return new Error("Something went wrong!!!");
    return BaseService.post(`class/new`, classInfo, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
}
export default ClassService;
