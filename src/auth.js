import React, { useEffect, useContext } from "react";
import UserService from "./services/UserService";
import Authpreloader from "./shared/components/authpreloader/Authpreloader";
import { Context } from "./shared/Util/context";
import popUpSubject from "./shared/Util/PopupSubject";

const Auth = ({ setAuth }) => {
  const { dispatch } = useContext(Context);
  useEffect(() => {
    UserService.auth()
      .then((data) => {
        if (data) {
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
      })
      .catch((error) =>
        popUpSubject.next({
          type: "WARN",
          message: error.response ? error.response.data : "Some errors occured",
          showTime: 5,
        })
      );
  }, []);

  return <Authpreloader />;
};

export default Auth;
