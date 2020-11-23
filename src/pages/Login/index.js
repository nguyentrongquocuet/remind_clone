import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import UserService from "../../services/UserService";
import { Context } from "../../shared/Util/context";
import LoginForm from "../../shared/components/LoginForm";
import "./Login.scss";
import Header from "../../shared/components/Header";
import Button from "../../shared/Elements/Button";
import PopupSubject from "../../shared/Util/PopupSubject";
const Login = () => {
  const { dispatch } = useContext(Context);
  //login with {email, password}
  const submitFormHandler = async (data) => {
    try {
      const authData = await UserService.login(data);
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

      // history.push("/classes/1");
    } catch (error) {
      if (error.response) {
        PopupSubject.next({
          type: "ERROR",
          message: error.response ? error.response.data : "Some errors occured",
          showTime: 5,
        });
      }
    }
  };
  return (
    <>
      <Header noChild>
        <span className="space"></span>
        <div className="header__actions flex-align">
          <Button
            color="primary"
            className="header__actions__e login-page__signup"
            href="/?signup=true"
            default
          >
            Signup
          </Button>
        </div>
      </Header>
      <div className="center">
        <LoginForm header={<h1>Login</h1>} login={submitFormHandler} />
      </div>
    </>
  );
};

export default Login;
