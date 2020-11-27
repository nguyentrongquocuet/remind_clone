import React, { useContext, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import UserService from "../../../services/UserService";
import { Context } from "../../Util/context";
import PopupSubject from "../../Util/PopupSubject";

const GoogleAuthPage = () => {
  const code = new URLSearchParams(useLocation().search).get("code");
  const { dispatch } = useContext(Context);
  const history = useHistory();
  useEffect(() => {
    const auth = async (code) => {
      try {
        const authData = await UserService.googleAuth(code);
        console.log("authData", authData);
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
        });
      } catch (error) {
        if (error.response.status === 401) {
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
