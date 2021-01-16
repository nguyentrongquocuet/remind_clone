import BaseService from "./BaseService";
import * as local from "../shared/Util/LocalStorage";

const clearAuthData = () => {
  local.deleteFromLocalStorage("token", "userData", "classData");
};

const getLocalData = () => {
  const { token, expiresIn, userData } = local.getFromLocalStorage(
    "token",
    "expiresIn",
    "userData"
  );
  if (!token) {
    clearAuthData();
    return null;
  } else {
    if (Date.parse(expiresIn) - new Date() < 0) {
      clearAuthData();
      return null;
    }
  }
  return { token, expiresIn, userData };
};
export class UserService {
  static login = (data) => {
    console.log("login");
    return BaseService.post("auth/login", data);
  };
  static signup = (data) => {
    return BaseService.post("auth/signup", data);
  };
  static setRole = (roleId) => {
    return BaseService.put("auth/role", { roleId: roleId });
  };
  static auth = async () => {
    const data = getLocalData();

    if (!data) {
      clearAuthData();
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
      clearAuthData();
      // alert(error.response.data);
    }
  };
  static confirmEmail = (code, email) => {
    return BaseService.post("auth/confirmEmail", {
      code: code,
      email: email,
    });
  };
  static confirmPasswordCode = (code, email, token) => {
    return BaseService.post("auth/confirmPasswordCode", {
      code: code,
      email: email,
      token: token,
    });
  };
  static resetPassword = (email) => {
    return BaseService.post("auth/resetPassword", {
      email: email,
    });
  };
  static changePasswordWithoutLogin = (email, password, repassword, token) => {
    return BaseService.post("auth/changePasswordWithoutLogin", {
      password: password,
      repassword: repassword,
      email: email,
      token: token,
    });
  };
  static googleAuth = (code) => {
    return BaseService.post("auth/withGoogle", {
      code: code,
    });
  };
  static getConnectChildUrl = () => {
    return BaseService.get("auth/connectUrl");
  };
  static connectChild = (connectToken) => {
    return BaseService.post("auth/connectChild", {
      connectToken: connectToken,
    });
  };
  static getUserInfo = (userId) => {
    return BaseService.get("auth/info", {
      params: {
        userId: userId,
      },
    });
  };
  static getMyFullInfo = (userId) => {
    return BaseService.get("auth/myInfo");
  };

  static changePasswordWithLogin = ({ newpass, retypepass }) => {
    return BaseService.post("auth/changePasswordWithLogin", {
      newpass,
      retypepass,
    });
  };

  static changeUserInfo = (data) => {
    return BaseService.post("auth/changeInfo", data);
  };

  static removeRelationship = (secondId) => {
    return BaseService.delete("auth/relationship", {
      params: {
        secondId,
      },
    });
  };
}
export default UserService;
