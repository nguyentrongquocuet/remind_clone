import React, { useEffect, useContext } from "react";
import UserService from "./services/UserService";
import Loading from "./shared/components/Loading";
import { Context } from "./shared/Util/context";
const Auth = ({ setAuth }) => {
  const { dispatch } = useContext(Context);
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
  return (
    <div style={{ textAlign: "center" }}>
      <h1>AUTHENTICATING</h1>
      <br />
      <br />
      <Loading />
    </div>
  );
};

export default Auth;
