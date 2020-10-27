import BaseService from "./BaseService";
import * as local from "../shared/Util/LocalStorage";
const getLocalData = () => {
  const { token, expiresIn, userData } = local.getFromLocalStorage(
    "token",
    "expiresIn",
    "userData"
  );
  if (!token) {
    local.deleteFromLocalStorage({ token, expiresIn, userData });
    return;
  } else {
    if (Date.parse(expiresIn) - new Date() < 0) {
      local.deleteFromLocalStorage({ token, expiresIn, userData });
      return;
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
  static auth = async () => {
    const data = getLocalData();
    console.log("from service", data);

    if (!data) return;
    let newUserData;
    try {
      console.log("token", data.token);

      newUserData = await BaseService.post("auth/auth", { token: data.token });
      local.saveToLocalStorage({ userData: newUserData.data });
      return { ...data, userData: newUserData.data };
    } catch (error) {
      local.deleteFromLocalStorage(data);
      alert(error.response.data);
    }
  };
}
export default UserService;
