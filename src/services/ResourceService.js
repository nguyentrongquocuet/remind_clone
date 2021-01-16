import BaseService from "./BaseService";

const basePath = "external";
export class ResourceService {
  static getDriveFiles(amount = 20, nextPageToken = null, namequery = null) {
    return BaseService.get(`${basePath}/filesFromDrive`, {
      params: {
        amount,
        nextPageToken,
        namequery,
      },
    });
  }
  static getClassroomCourses(amount = 20, nextPageToken = null) {
    return BaseService.get(`${basePath}/coursesFromClassroom`, {
      params: {
        amount,
        nextPageToken,
      },
    });
  }
}
