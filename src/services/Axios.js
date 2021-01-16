import Axios from "axios";
import PopupSubject from "shared/Util/PopupSubject";
const baseUrl = process.env.REACT_APP_SERVER_URL;
const AxiosInstance = Axios.create();

var once = false;

const getNewToken = async () => {
  try {
    const raw_token = localStorage.getItem("token");

    if (raw_token) {
      const refreshToken = JSON.parse(raw_token).refreshToken;
      const newTokenData = await AxiosInstance.get(`${baseUrl}/auth/newToken`, {
        params: {
          refresh_token: refreshToken,
        },
      });
      const newToken = newTokenData.data.token;
      localStorage.setItem(
        "token",
        JSON.stringify({ ...newToken, refreshToken })
      );
    }
  } catch (error) {
    console.log("RETRY FAILED");
    once = true;
    return error;
  }
};

AxiosInstance.interceptors.request.use(
  (req) => {
    console.log(req);
    if (req.url === `${baseUrl}/auth/login`) once = false;
    const raw_token = localStorage.getItem("token");
    req.headers = {
      ...req.headers,
      Authorization: raw_token
        ? `Bearer ${JSON.parse(raw_token).accessToken}`
        : "",
      // Accept: "application/json",
    };
    return req;
  },
  (err) => {
    console.log(err);
    return Promise.reject(err);
  }
);

AxiosInstance.interceptors.response.use(
  (res) => {
    if (res.data.message) {
      PopupSubject.next({
        type: "SUCCESS",
        message: res.data.message,
        showTime: 5,
      });
    }
    return res;
  },
  async (error) => {
    // console.dir(err);
    console.log("CHECK_ERROR", error);
    const originalRequest = error.config;
    if (error.response && error.response.status === 401) {
      if (!once) {
        console.log("RETRY");
        await getNewToken();
        return AxiosInstance(originalRequest);
      } else {
        PopupSubject.next({
          type: "ERROR",
          message: error.response ? error.response.data : "Invalid credentials",
          showTime: 5,
        });
      }
    } else {
      // alert("error");
      if (error.response) {
        if (typeof error.response.data === "string") {
          PopupSubject.next({
            type: "WARN",
            message: error.response
              ? error.response.data
              : "Something went wrong!!!",
            showTime: 5,
            accepted: true,
          });
        } else if (error.response.data.hasOwnProperty("message")) {
          PopupSubject.next({
            type: "WARN",
            message: error.response.data.message,
            showTime: 5,
            accepted: true,
          });
        }
      }
    }
    return Promise.reject({
      response: {
        message: error.response
          ? error.response.data
          : "Something went wrong!!!",
        status: error.response ? error.response.status : 500,
      },
    });
  }
);

export default AxiosInstance;
