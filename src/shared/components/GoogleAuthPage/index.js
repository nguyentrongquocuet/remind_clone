import React, { useContext, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import UserService from "../../../services/UserService";
import { Context } from "../../Util/context";
import PopupSubject from "../../Util/PopupSubject";

const GoogleAuthPage = () => {
  const code = new URLSearchParams(useLocation().search).get("code");
  const { dispatch } = useContext(Context);
  const history = useHistory();
  if (!code) history.push("/");
  useEffect(() => {
    const auth = async (code) => {
      try {
        const authData = await UserService.googleAuth(code);
        console.log("authData", authData);
        const url = localStorage.getItem("redirectUrl");
        let redirectUrl;
        if (url && url != "undefined") {
          redirectUrl = JSON.parse(url);
        }

        dispatch({
          1: {
            type: "SET_TOKEN",
            payload: authData.data.token,
          },
          2: {
            type: "SET_USER_DATA",
            payload: authData.data.userData,
          },
          3: {
            type: "LOGIN_SUCCESS",
          },
          4: {
            type: "SET_REDIRECT_URL",
            payload: {
              url: redirectUrl,
            },
          },
        });
      } catch (error) {
        console.log(error);
        if (error.response && error.response.status === 401) {
          history.push("/login");
          PopupSubject.next({
            type: "WARN",
            message: error.response
              ? error.response.data
              : "Some errors occurred",
            showTime: 5,
          });
        }
      }
    };
    if (code) auth(code);
  }, [code]);

  return <div>Authenticating</div>;
};

export default GoogleAuthPage;
