import BaseService from "./BaseService";
const prefix = "admin";
class AdminService {
  static getUserAmount = () => {
    return BaseService.get(`${prefix}/userAmount`);
  };

  static getClassAmount = () => {
    return BaseService.get(`${prefix}/classAmount`);
  };
  static getVisitorAmount = () => {
    return BaseService.get(`${prefix}/visitorAmount`);
  };
  static getRequestAmount = () => {
    return BaseService.get(`${prefix}/requestAmount`);
  };

  static getUsers = (options) => {
    return BaseService.get(`${prefix}/users`, {
      params: {
        ...options,
      },
    });
  };
  static getClasses = (options) => {
    return BaseService.get(`${prefix}/classes`, {
      params: {
        ...options,
      },
    });
  };

  static createUser = (data) => {
    return BaseService.post(`${prefix}/newUser`, data);
  };

  static createClass = (classInfo) => {
    return BaseService.post(`${prefix}/newClass`, classInfo);
  };

  static modifyUser = (data) => {
    return BaseService.put(`${prefix}/modifyUser`, data);
  };

  static getUsersClasses = (userId) => {
    return BaseService.get(`${prefix}/usersClasses`, {
      params: {
        id: userId,
      },
    });
  };
  static getUsersRelationships = (userId) => {
    return BaseService.get(`${prefix}/usersRelationships`, {
      params: {
        id: userId,
      },
    });
  };

  static getUserById = (id) => {
    return BaseService.get(`${prefix}/user`, {
      params: {
        id: id,
      },
    });
  };

  static removeClass = (classId) => {
    return BaseService.delete(`${prefix}/removeClass`, {
      params: {
        classId,
      },
    });
  };

  static getClassInfo = (classId) => {
    return BaseService.get(`${prefix}/classById`, {
      params: {
        classId,
      },
    });
  };

  static getFullClassInfo = (classId) => {
    return BaseService.get(`${prefix}/fullClassInfo`, {
      params: {
        classId,
      },
    });
  };

  static getClassMember = (classId) => {
    return BaseService.get(`${prefix}/classMember`, {
      params: {
        classId,
      },
    });
  };

  static modifyClass = (data) => {
    return BaseService.put(`${prefix}/modifyClass`, data);
  };

  static removeClassMember = (classId, id) => {
    return BaseService.delete(`${prefix}/removeClassMember`, {
      params: {
        id: id,
        classId: classId,
      },
    });
  };

  static revokeUser = (id) => {
    return BaseService.delete(`${prefix}/removeUser`, {
      params: {
        id: id,
      },
    });
  };

  static removeRelationship = (firstId, secondId) => {
    return BaseService.delete(`${prefix}/removeRelationship`, {
      params: {
        firstId,
        secondId,
      },
    });
  };
}

export default AdminService;
