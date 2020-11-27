import { TextField } from "@material-ui/core";
import React, { useState } from "react";
import Button from "../../shared/Elements/Button";
import { useForm } from "react-hook-form";
import UserService from "../../services/UserService";
import PopupSubject from "../../shared/Util/PopupSubject";
const NewPassword = ({ onSuccess }) => {
  const { register, handleSubmit, watch, errors, formState } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      repassword: "",
    },
    reValidateMode: "onChange",
  });
  const [code, setCode] = useState({
    code: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [password_token, setPassword_Token] = useState(null);
  const [newpassword_token, setNewpassword_Token] = useState(null);
  const verifyResetCode = async () => {
    try {
      setLoading(true);
      const authData = await UserService.confirmPasswordCode(
        code.code,
        code.email,
        password_token.token
      );
      setNewpassword_Token(authData.data);
      setLoading(false);
      setMode(3);
    } catch (error) {
      setLoading(false);
      PopupSubject.next({
        type: "WARN",
        message: error.response ? error.response.data : "Some errors occurred",
        showTime: 5,
      });
    }
  };
  const [mode, setMode] = useState(1);

  const forgotPassword = async () => {
    try {
      setLoading(true);
      const passTokenData = await UserService.resetPassword(code.email);
      setPassword_Token(passTokenData.data);
      setLoading(false);
      setMode(2);
    } catch (error) {
      setLoading(false);
      if (error.response) {
        if (error.response.status === 401) {
          setMode(2);
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
  const changePasswordWithoutLogin = async (data) => {
    try {
      setLoading(true);
      await UserService.changePasswordWithoutLogin(
        code.email,
        data.password,
        data.repassword,
        newpassword_token.token
      );
      setLoading(false);
      PopupSubject.next({
        type: "SUCCESS",
        message: "Change password successfully, please remember your password!",
        showTime: 5,
      });
      onSuccess();
    } catch (error) {
      setLoading(false);
      if (error.response) {
        if (error.response.status === 401) {
          setMode(2);
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
  if (mode === 1) {
    return (
      <>
        <div className="confirm-code center">
          <h1 style={{ color: "var(--primary)" }}>Enter your email</h1>
          <br />
          <TextField
            value={code.email}
            onChange={(e) => {
              setCode((prev) => {
                return { ...prev, email: e.target.value };
              });
            }}
          />
          <br />
          <Button
            onClick={(e) => {
              forgotPassword();
            }}
            disabled={loading}
          >
            Confirm
          </Button>
        </div>
      </>
    );
  }
  if (mode === 2) {
    return (
      <div className="confirm-code center">
        <h3>
          Verify code have been sent to your email.Enter Code Below. You have{" "}
          {password_token.expiresIn}s
        </h3>
        <TextField
          onChange={(e) => {
            setCode((prev) => {
              return { ...prev, code: e.target.value };
            });
          }}
          value={code.code}
        />
        <Button disabled={loading} onClick={(e) => verifyResetCode()}>
          Verify
        </Button>
        <Button
          onClick={(e) => {
            forgotPassword();
          }}
          disabled={loading}
        >
          Resend
        </Button>
      </div>
    );
  }
  return (
    <form onSubmit={handleSubmit(changePasswordWithoutLogin)}>
      <h1>You Have {newpassword_token.expiresIn}s</h1>
      <TextField
        type="password"
        label="Password"
        fullWidth
        variant="outlined"
        // style={{ marginBottom: "1rem" }}
        className="no-pad newpassword"
        name="password"
        inputRef={register({
          minLength: { value: 6, message: "At least 6 characters" },
          required: "Password is required!",
        })}
        helperText={errors.password ? errors.password.message : null}
      />
      <TextField
        type="password"
        label="RePassword"
        fullWidth
        variant="outlined"
        style={{ marginBottom: "1rem" }}
        className="no-pad newpassword"
        name="repassword"
        inputRef={register({
          minLength: { value: 6, message: "At least 6 characters" },
          required: "RePassword is required!",
          validate: (value) =>
            value === watch("password") || "2 passwords must be the same",
        })}
        helperText={errors.repassword ? errors.repassword.message : null}
      />
      <Button
        disabled={!formState.isValid}
        type="submit"
        className="signupform__button"
        color="primary"
      >
        Confirm
      </Button>
    </form>
  );
};

export default NewPassword;
