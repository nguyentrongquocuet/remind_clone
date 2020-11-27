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
  static editSchedule = (scheduleId, data) => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) return new Error("Something went wrong");
    return BaseService.put(`message/announcement`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        scheduleId: scheduleId,
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
  static deleteSchedule = (scheduleId) => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) return new Error("Something went wrong");
    return BaseService.delete(`message/schedule`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        scheduleId: scheduleId,
      },
    });
  };
  static getFiles = (classId) => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) return new Error("Something went wrong!!!");
    return BaseService.get(`message/files`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        classId: classId,
      },
    });
  };
  static getFileDetails = (messageId) => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) return new Error("Something went wrong!!!");
    return BaseService.get(`message/fileDetails`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        messageId: messageId,
      },
    });
  };
}
export default MessageService;
