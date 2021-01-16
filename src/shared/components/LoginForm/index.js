import React from "react";
import { useForm } from "react-hook-form";
import { CardActions, CardContent } from "@material-ui/core";
import TextField from "../../Elements/TextField";
import Button from "../../Elements/Button";
import Card from "../../Elements/Card";
import "./LoginForm.scss";
import WithGoogleBtn from "../../Elements/SignWithGoogleButton/WithGoogleBtn";
import VALIDATOR from "../../Util/Validator";

const LoginForm = (props) => {
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
              ...VALIDATOR.EMAIL.REQUIRED,
              ...VALIDATOR.EMAIL.PARTTERN,
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
              ...VALIDATOR.PASSWORD,
            })}
            helperText={errors.password ? errors.password.message : null}
          />
        </CardContent>

        <CardActions className="no-pad">
          <Button
            disabled={!formState.isValid || props.loading}
            type="submit"
            className="loginform__button"
          >
            Login
          </Button>
        </CardActions>
        {/* <span>Or</span> */}
        <br />
        <WithGoogleBtn className="loginform__button" />
        <Button
          className="loginform__button"
          onClick={(e) => {
            props.forgotPassword(formState.email);
          }}
        >
          Forgot Password
        </Button>
      </form>
    </Card>
  );
};

export default LoginForm;
