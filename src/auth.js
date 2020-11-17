import React, { useEffect, useContext } from "react";
import UserService from "./services/UserService";
import Authpreloader from "./shared/components/authpreloader/Authpreloader";
import { Context } from "./shared/Util/context";
import io from "socket.io-client";

const Auth = ({ setAuth }) => {
  const { dispatch, globalState } = useContext(Context);
  const { isLoggedIn, userData } = globalState;
  useEffect(() => {
    UserService.auth().then((data) => {
      console.log("data", data);
      if (!data) {
        console.log("LOGD");
        dispatch({
          type: "LOGOUT",
        });
      } else {
        dispatch({
          1: {
            type: "SET_TOKEN",
            payload: data.token,
          },
          2: {
            type: "SET_USER_DATA",
            payload: data.userData,
          },
          3: {
            type: "LOGIN_SUCCESS",
          },
        });
      }
      // setTimeout(() => setAuth(true), 1000);
      setAuth(true);
    });
  }, []);

  return <Authpreloader />;
};

export default Auth;
