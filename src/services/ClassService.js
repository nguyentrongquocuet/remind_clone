import BaseService from "./BaseService";
export class ClassService {
  static getClass = () => {
    return BaseService.get(`class`);
  };
  static joinClass = (classId) => {
    return BaseService.post(`class/join`, { classId: classId });
  };
  static invite = (invitationList, classId) => {
    return BaseService.post(`class/invite`, {
      invitationList: invitationList,
      classId: classId,
    });
  };
  static leaveClass = (classId) => {
    return BaseService.delete("class/leave", {
      params: {
        classId: classId,
      },
    });
  };
  static findClass = (query, notJoined) => {
    return BaseService.get(`class/find`, {
      params: {
        query: query,
        notJoined: Boolean(notJoined),
      },
    });
  };
  static getClassMembers = (classId, role) => {
    return BaseService.get(`class/member`, {
      params: {
        classId: classId,
        role: role,
      },
    });
  };

  static getChildClasses = (childId) => {
    return BaseService.get(`class/child`, {
      params: {
        childId: childId,
      },
    });
  };

  static createClass = (classInfo) => {
    return BaseService.post(`class/new`, classInfo, {});
  };

  static getSettings = (classId) => {
    return BaseService.get(`class/classSettings`, {
      params: {
        classId: classId,
      },
    });
  };

  static modifyClass = (classData) => {
    return BaseService.put(`class/classSettings`, classData);
  };
}
export default ClassService;
