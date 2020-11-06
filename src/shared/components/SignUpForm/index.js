import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { CardActions, CardContent, TextField } from "@material-ui/core";
import UserService from "../../../services/UserService";
import Button from "../../Elements/Button";
import Card from "../../Elements/Card";
import "./SignUpForm.scss";

const SignUpForm = (props) => {
  const { register, handleSubmit, watch, errors, formState } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      repassword: "",
    },
    reValidateMode: "onChange",
  });

  const signup = useCallback(
    async (data) => {
      console.log(data);
      try {
        await UserService.signup(data);
        props.onSuccess(data);
      } catch (error) {
        alert(error.response.data);
      }
    },
    [props]
  );

  const onSubmit = (data, e) => {
    e.preventDefault();
    signup(data);
  };

  const valdations = {
    email: {
      required: "Email is required!",
      pattern: {
        value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]{2,})*$/,
        message: "Invalid email address format",
      },
    },
  };

  return (
    <Card
      className="signup"
      style={{ borderRadius: ".6rem", backgroundColor: "red" }}
    >
      {props.header}
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="no-pad">
          <TextField
            label="Email address"
            fullWidth
            variant="outlined"
            style={{ marginBottom: "1rem" }}
            className="no-pad"
            name="email"
            inputRef={register(valdations.email)}
            helperText={errors.email ? errors.email.message : null}
          />
          <TextField
            label="First Name"
            fullWidth
            variant="outlined"
            style={{ marginBottom: "1rem" }}
            className="no-pad"
            name="firstname"
            inputRef={register({
              required: "Firstname is required!",
              minLength: { value: 3, message: "At least 3 characters" },
            })}
            helperText={errors.firstname ? errors.firstname.message : null}
          />
          <TextField
            label="Last Name"
            fullWidth
            variant="outlined"
            style={{ marginBottom: "1rem" }}
            className="no-pad"
            name="lastname"
            inputRef={register({
              required: "Lastname is required!",
              minLength: { value: 3, message: "At least 3 characters" },
            })}
            helperText={errors.lastname ? errors.lastname.message : null}
          />
          <TextField
            type="password"
            label="Password"
            fullWidth
            variant="outlined"
            // style={{ marginBottom: "1rem" }}
            className="no-pad"
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
            className="no-pad"
            name="repassword"
            inputRef={register({
              minLength: { value: 6, message: "At least 6 characters" },
              required: "RePassword is required!",
              validate: (value) =>
                value === watch("password") || "2 passwords must be the same",
            })}
            helperText={errors.repassword ? errors.repassword.message : null}
          />
        </CardContent>

        <CardActions className="no-pad">
          <Button
            disabled={!formState.isValid}
            type="submit"
            className="signupform__button"
          >
            Signup
          </Button>
        </CardActions>
        <br />
        <Button
          className="signupform__button"
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
