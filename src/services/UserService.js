import BaseService from "./BaseService";
import * as local from "../shared/Util/LocalStorage";
const getLocalData = () => {
  const { token, expiresIn, userData } = local.getFromLocalStorage(
    "token",
    "expiresIn",
    "userData"
  );
  if (!token) {
    localStorage.clear();
    return null;
  } else {
    if (Date.parse(expiresIn) - new Date() < 0) {
      localStorage.clear();
      return null;
    }
  }
  return { token, expiresIn, userData };
};
export class UserService {
  static login = (data) => {
    return BaseService.post("auth/login", data);
  };
  static signup = (data) => {
    return BaseService.post("auth/signup", data);
  };
  static setRole = (roleId) => {
    const token = JSON.parse(localStorage.getItem("token"));
    return BaseService.put(
      "auth/role",
      { roleId: roleId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };
  static auth = async () => {
    const data = getLocalData();

    if (!data) {
      localStorage.clear();
      return;
    }
    let newUserData;
    try {
      newUserData = await BaseService.post("auth/auth", null, {
        headers: { Authorization: `Bearer ${data.token}` },
      });
      local.saveToLocalStorage({ userData: newUserData.data });
      return { ...data, userData: newUserData.data };
    } catch (error) {
      localStorage.clear();
      // alert(error.response.data);
    }
  };
}
export default UserService;
