import React from "react";
import { useForm } from "react-hook-form";
import { CardActions, CardContent, TextField } from "@material-ui/core";
import Button from "../../Elements/Button";
import Card from "../../Elements/Card";
import "./LoginForm.scss";

const SignUpForm = (props) => {
  const { register, handleSubmit, errors, formState } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
    reValidateMode: "onChange",
  });

  const onSubmit = (data, e) => {
    e.preventDefault();
    props.login(data);
  };

  return (
    <Card className="login login__wrapper" style={{ borderRadius: ".6rem" }}>
      {props.header}
      <br />
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="no-pad">
          <TextField
            label="Email address"
            fullWidth
            variant="outlined"
            className="no-pad"
            name="email"
            inputRef={register({
              required: "Email is required!",
              pattern: {
                value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]{2,})*$/,
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
            className="no-pad"
            name="password"
            inputRef={register({
              minLength: { value: 6, message: "At least 6 digits" },
              required: "Password is required!",
            })}
            helperText={errors.password ? errors.password.message : null}
          />
        </CardContent>

        <CardActions className="no-pad">
          <Button
            disabled={!formState.isValid}
            type="submit"
            className="loginform__button"
          >
            Login
          </Button>
        </CardActions>
        {/* <span>Or</span> */}
        <br />
        <Button
          disabled
          className="loginform__button"
          onClick={(e) => {
            alert("sign with google");
          }}
        >
          Login With Google
        </Button>
      </form>
    </Card>
  );
};

export default SignUpForm;
