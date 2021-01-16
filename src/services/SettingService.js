import BaseService from "./BaseService";

export class SettingService {
  static getGoogleLoginUrl() {
    return BaseService.get("setting");
  }
}
