import React, { useContext, useState } from "react";
import UserService from "../../services/UserService";
import { Context } from "../../shared/Util/context";
import LoginForm from "../../shared/components/LoginForm";
import "./Login.scss";
import Header from "../../shared/components/Header";
import Button from "../../shared/Elements/Button";
import PopupSubject from "../../shared/Util/PopupSubject";
import { TextField } from "@material-ui/core";
import NewPassword from "./NewPassword";
import { useHistory } from "react-router-dom";
//1:login,2:enter email for reset, 3: enter code, 4r:
const Login = () => {
  const { dispatch, globalState } = useContext(Context);
  //login with {email, password}
  const [mode, setMode] = useState(1);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [code, setCode] = useState({
    code: "",
    email: "",
  });
  const submitFormHandler = async (data) => {
    try {
      setLoading(true);
      setCode((prev) => {
        return {
          ...prev,
          email: data.email,
        };
      });
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
      setLoading(false);
      // history.push("/classes/1");
    } catch (error) {
      setLoading(false);
      if (error.response) {
        if (error.response.status === 401) {
          setMode(3);
        } else
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
  const verifyCode = async () => {
    try {
      setLoading(true);
      await UserService.confirmEmail(code.code, code.email);
      PopupSubject.next({
        type: "SUCCESS",
        message: "Verified, please login again",
        showTime: 5,
      });
      setLoading(false);
      setMode(1);
    } catch (error) {
      setLoading(false);
      PopupSubject.next({
        type: "WARN",
        message: error.response ? error.response.data : "Some errors occurred",
        showTime: 5,
      });
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
            disabled={loading}
          >
            Signup
          </Button>
        </div>
      </Header>
      <div className="center">
        {mode === 1 && (
          <LoginForm
            loading={loading}
            forgotPassword={(e) => setMode(2)}
            header={<h1>Login</h1>}
            login={submitFormHandler}
          />
        )}
        {mode === 2 && <NewPassword onSuccess={() => setMode(1)} />}
        {mode === 3 && (
          <div className="confirm-code center">
            <h3>Verify code have been sent to your email.Enter Code Below</h3>
            <TextField
              onChange={(e) => {
                setCode((prev) => {
                  return { ...prev, code: e.target.value };
                });
              }}
              value={code.code}
            />
            <Button disabled={loading} onClick={(e) => verifyCode()}>
              Verify
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default Login;
