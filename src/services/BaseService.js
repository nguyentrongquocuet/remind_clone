import axios from "axios";
const baseUrl = process.env.REACT_APP_SERVER_URL;

export class BaseService {
  static get = (path) => {
    return axios.get(`${baseUrl}/${path}`);
  };
  static post = (path, data) => {
    return axios.post(`${baseUrl}/${path}`, data);
  };
}

export default BaseService;
