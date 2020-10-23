import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Card, CardActions, CardContent, TextField } from "@material-ui/core";
import UserService from "../../../services/UserService";
import Button from "../../Elements/Button";
import "./SignUpForm.css";
const SignUpForm = (props) => {
  const { register, handleSubmit, getValues, watch, errors } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      repassword: "",
    },
    reValidateMode: "onChange",
  });
  const signup = useCallback(async (data) => {
    const response = await (await UserService.signup(data)).data;
    console.log(response);
  }, []);
  const onSubmit = (data, e) => {
    e.preventDefault();
    signup(getValues);
  };
  const onErrors = (errors, e) => {
    e.preventDefault();
    console.log(getValues());
    console.log(errors);
    alert("form is invalid");
  };

  return (
    <Card className="signup" style={{ borderRadius: ".6rem" }}>
      {props.header}
      <form onSubmit={handleSubmit(onSubmit, onErrors)}>
        <CardContent className="no-pad">
          <TextField
            label="Email address"
            fullWidth
            variant="outlined"
            style={{ marginBottom: "1rem" }}
            className="no-pad"
            name="email"
            inputRef={register({
              required: "Password is required!",
              pattern: {
                value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                message: "Invalid email address format",
              },
            })}
            helperText={errors.email ? errors.email.message : null}
          />
          <TextField
            type="password"
            label="Password"
            fullWidth
            variant="outlined"
            style={{ marginBottom: "1rem" }}
            className="no-pad"
            name="password"
            inputRef={register({
              minLength: { value: 6, message: "At least 6 digits" },
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
            className="no-pad"
            name="repassword"
            inputRef={register({
              minLength: { value: 6, message: "At least 6 digits" },
              required: "RePassword is required!",
              validate: (value) =>
                value === watch("password") || "2 passwords must be the same",
            })}
            helperText={errors.repassword ? errors.repassword.message : null}
          />
        </CardContent>

        <CardActions className="no-pad">
          <Button type="submit" style={{ width: "100%" }}>
            Login
          </Button>
        </CardActions>
        <span>Or</span>
        <Button
          style={{ width: "100%" }}
          onClick={(e) => {
            alert("sign with google");
          }}
        >
          Signup With Google
        </Button>
      </form>
    </Card>
  );
};

export default SignUpForm;
