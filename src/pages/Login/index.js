import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import UserService from "../../services/UserService";
import { Context } from "../../shared/Util/context";
import LoginForm from "../../shared/components/LoginForm";
import "./Login.scss";
import Header from "../../shared/components/Header";
import Button from "../../shared/Elements/Button";
const Login = () => {
  const { dispatch } = useContext(Context);
  //login with {email, password}
  console.log(dispatch);
  const submitFormHandler = async (data) => {
    try {
      const authData = await UserService.login(data);
      console.log(authData);
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
        alert(error.response.data);
        console.log(error.response);
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
            style={{
              padding: "0.5rem 1rem",
              color: "#fafafa",
              backgroundColor: "#0274de",
              marginLeft: "1.5rem",
            }}
            href="/?signup=true"
            className="header__actions__e"
            default
          >
            Signup
          </Button>
        </div>
      </Header>
      <div className="login__wrapper center">
        <LoginForm header={<h1>Login</h1>} login={submitFormHandler} />
      </div>
    </>
  );
};

export default Login;
