import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import UserService from "../../services/UserService";
import { Context } from "../../shared/Util/context";
import LoginForm from "../../shared/components/LoginForm";

import "./Login.css";
const Login = () => {
  let history = useHistory();
  const { login } = useContext(Context);

  const submitFormHandler = async (data) => {
    try {
      await (await UserService.login(data)).data;
      login();
      history.push("/");
      alert("login successfully");
    } catch (error) {
      alert("cannot login");
    }
  };
  return (
    <div className="login__wrapper center">
      <LoginForm header={<h1>Login</h1>} login={submitFormHandler} />
    </div>
  );
};

export default Login;
