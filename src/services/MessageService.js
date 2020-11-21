import BaseService from "./BaseService";
export class MessageService {
  static sendMessage = (roomId, data) => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) throw new Error("Something went wrong");
    return BaseService.post(`message/?roomId=${roomId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  static sendAnnouncement = (data) => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) throw new Error("Something went wrong");
    return BaseService.post(`message/announcement`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  //included announcements
  static getMessages = (roomId) => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) throw new Error("Something went wrong");
    return BaseService.get(`message/?roomId=${roomId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
}
export default MessageService;
