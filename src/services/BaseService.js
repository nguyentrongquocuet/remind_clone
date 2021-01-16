import AxiosInstance from "./Axios";
const baseUrl = process.env.REACT_APP_SERVER_URL;
export class BaseService {
  static get = (path, config) => {
    console.log("SERVICE RUNNING", path);
    return AxiosInstance.get(`${baseUrl}/${path}`, config);
  };
  static post = (path, data, config) => {
    console.log("SERVICE RUNNING", `${baseUrl}/${path}`);
    return AxiosInstance.post(`${baseUrl}/${path}`, data, config);
  };

  static delete = (path, config) => {
    console.log("SERVICE RUNNING", path);
    return AxiosInstance.delete(`${baseUrl}/${path}`, config);
  };
  static put = (path, data, config) => {
    console.log("SERVICE RUNNING", path);
    return AxiosInstance.put(`${baseUrl}/${path}`, data, config);
  };
}

export default BaseService;
