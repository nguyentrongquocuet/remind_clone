import axios from "axios";
const baseUrl = process.env.REACT_APP_SERVER_URL;

export class BaseService {
  static get = (path, config) => {
    return axios.get(`${baseUrl}/${path}`, config);
  };
  static post = (path, data, config) => {
    return axios.post(`${baseUrl}/${path}`, data, config);
  };

  static delete = (path, config) => {
    return axios.delete(`${baseUrl}/${path}`, config);
  };
  static put = (path, data, config) => {
    return axios.put(`${baseUrl}/${path}`, data, config);
  };
  static getCancelToken = () => {
    return axios.CancelToken;
  };
}

export default BaseService;
