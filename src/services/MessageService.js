import BaseService from "./BaseService";
export class MessageService {
  static sendMessage = (roomId, data) => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) return new Error("Something went wrong");
    return BaseService.post(`message/?roomId=${roomId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  static sendAnnouncement = (data) => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) return new Error("Something went wrong");
    return BaseService.post(`message/announcement`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  static editSchedule = (data) => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) return new Error("Something went wrong");
    return BaseService.put(`message/announcement`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  //included announcements
  static getMessages = (roomId) => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) return new Error("Something went wrong");
    return BaseService.get(`message`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        roomId: roomId,
      },
    });
  };
  static getScheduleDetails = (scheduleId) => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) return new Error("Something went wrong");
    return BaseService.get(`message/schedule`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        scheduleId: scheduleId,
      },
    });
  };
}
export default MessageService;
