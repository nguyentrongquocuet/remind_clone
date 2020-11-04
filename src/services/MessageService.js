import BaseService from "./BaseService";
export class MessageService {
  static sendMessage = (roomId, data, token) => {
    if (!token) throw new Error("Something went wrong");
    return BaseService.post(`message/?roomId=${roomId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  static getMessages = (roomId, token) => {
    if (!token) throw new Error("Something went wrong");
    return BaseService.get(`message/?roomId=${roomId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
}
export default MessageService;
