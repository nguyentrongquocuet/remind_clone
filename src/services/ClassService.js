import BaseService from "./BaseService";
export class ClassService {
  static getClass = (token) => {
    if (!token) throw Error("Something went wrong!!!");
    return BaseService.get(`class`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };
  static joinClass = (classId, token) => {
    if (!token || !classId) throw Error("Something went wrong!!!");
    return BaseService.post(
      `class/join`,
      { classId: classId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  };
  static leaveClass = (classId, token) => {
    if (!token || classId) throw Error("Something went wrong!!!");
    return BaseService.delete("class/leave", {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        classId: classId,
      },
    });
  };
  static findClass = (query, token) => {
    if (!token || !query) throw Error("Something went wrong!!!");
    return BaseService.get(`class/find`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        query: query,
      },
    });
  };
  static getClassMembers = (classId, token) => {
    if (!token || !classId) throw Error("Something went wrong!!!");
    return BaseService.get(`class/member`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        classId: classId,
      },
    });
  };
}
export default ClassService;
