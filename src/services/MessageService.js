import BaseService from "./BaseService";
export class MessageService {
  static sendMessage = (roomId, data) => {
    return BaseService.post(`message/?roomId=${roomId}`, data);
  };
  static sendAnnouncement = (data) => {
    return BaseService.post(`message/announcement`, data);
  };
  static editSchedule = (scheduleId, data) => {
    return BaseService.put(`message/announcement`, data, {
      params: {
        scheduleId: scheduleId,
      },
    });
  };
  //included announcements
  static getMessages = (roomId) => {
    return BaseService.get(`message`, {
      params: {
        roomId: roomId,
      },
    });
  };

  static getSchedules = (roomId) => {
    return BaseService.get(`message/schedules`, {
      params: {
        roomId: roomId,
      },
    });
  };

  static getScheduleDetails = (scheduleId) => {
    return BaseService.get(`message/schedule`, {
      params: {
        scheduleId: scheduleId,
      },
    });
  };
  static deleteSchedule = (scheduleId) => {
    return BaseService.delete(`message/schedule`, {
      params: {
        scheduleId: scheduleId,
      },
    });
  };
  static getFiles = (classId) => {
    return BaseService.get(`message/files`, {
      params: {
        classId: classId,
      },
    });
  };
  static getFileDetails = (messageId) => {
    return BaseService.get(`message/fileDetails`, {
      params: {
        messageId: messageId,
      },
    });
  };
  static initialPrivateRoom = (receiverId) => {
    return BaseService.post("message/initialPrivateRoom", {
      receiverId: receiverId,
    });
  };

  static getPrivateChatData = (classId) => {
    return BaseService.get("message/getPrivateConversationData", {
      params: {
        classId: classId,
      },
    });
  };
}
export default MessageService;
