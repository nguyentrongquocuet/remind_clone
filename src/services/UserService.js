import BaseService from "./BaseService";

export class UserService {
  static login = (data) => {
    return BaseService.post("auth/login", data);
  };
  static signup = (data) => {
    return BaseService.post("auth/signup", data);
  };
  static auth = (data) => {
    return BaseService.post("/auth/auth", data);
  };
}
export default UserService;
