import axios from "axios";
const baseUrl = process.env.REACT_APP_SERVER_URL;

export class BaseService {
  static get = (path, config) => {
    console.log("SERVICE RUNNING", path);
    return axios.get(`${baseUrl}/${path}`, config);
  };
  static post = (path, data, config) => {
    console.log("SERVICE RUNNING", path);
    return axios.post(`${baseUrl}/${path}`, data, config);
  };

  static delete = (path, config) => {
    console.log("SERVICE RUNNING", path);
    return axios.delete(`${baseUrl}/${path}`, config);
  };
  static put = (path, data, config) => {
    console.log("SERVICE RUNNING", path);
    return axios.put(`${baseUrl}/${path}`, data, config);
  };
}

export default BaseService;
