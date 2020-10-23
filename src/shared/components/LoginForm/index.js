import React from "react";
import { useForm } from "react-hook-form";
import { Card, CardActions, CardContent, TextField } from "@material-ui/core";
import Button from "../../Elements/Button";
import "./LoginForm.css";

const SignUpForm = (props) => {
  const { register, handleSubmit, getValues, errors } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
    reValidateMode: "onChange",
  });

  const onSubmit = (data, e) => {
    e.preventDefault();
    console.log(getValues());
    props.login(data);
  };

  return (
    <Card className="login" style={{ borderRadius: ".6rem" }}>
      {props.header}
      <br />
      <form onSubmit={handleSubmit(onSubmit)}>
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
          Login With Google
        </Button>
      </form>
    </Card>
  );
};

export default SignUpForm;
