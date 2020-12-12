import BaseService from "./BaseService";
const prefix = "admin";
class AdminService {
  static getUserAmount = () => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) return new Error("Something went wrong!!!");
    return BaseService.get(`${prefix}/userAmount`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  static getClassAmount = () => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) return new Error("Something went wrong!!!");
    return BaseService.get(`${prefix}/classAmount`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };
  static getVisitorAmount = () => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) return new Error("Something went wrong!!!");
    return BaseService.get(`${prefix}/visitorAmount`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };
  static getRequestAmount = () => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) return new Error("Something went wrong!!!");
    return BaseService.get(`${prefix}/requestAmount`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  static getUsers = () => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) return new Error("Something went wrong!!!");
    return BaseService.get(`${prefix}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };
}

export default AdminService;
