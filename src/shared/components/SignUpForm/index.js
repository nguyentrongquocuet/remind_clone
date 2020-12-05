import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { CardActions, CardContent, TextField } from "@material-ui/core";
import UserService from "../../../services/UserService";
import Button from "../../Elements/Button";
import Card from "../../Elements/Card";
import PopupSubject from "../../Util/PopupSubject";
import "./SignUpForm.scss";
import WithGoogleBtn from "../../Elements/SignWithGoogleButton/WithGoogleBtn";
import DateTimePicker from "../../Elements/DateTimePicker";
import MenuItem from "@material-ui/core/MenuItem";
import moment from "moment";
import VALIDATOR from "../../Util/Validator";
const SignUpForm = ({ initialMode = 1, ...props }) => {
  const {
    register,
    handleSubmit,
    watch,
    errors,
    formState,
    getValues,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      repassword: "",
    },
    reValidateMode: "onChange",
  });
  const [mode, setMode] = useState(1);
  const [code, setCode] = useState({ code: "", email: "", data: null });
  const [additionInfo, setAdditionInfo] = useState({
    birthday: null,
    gender: "Male",
  });
  const sendCode = async () => {
    try {
      await UserService.confirmEmail(code.code, code.email);
      props.onSuccess(code.data);
    } catch (error) {
      error.response &&
        PopupSubject.next({
          type: "WARN",
          message: error.response ? error.response.data : "Some errors occured",
          showTime: 5,
        });
    }
  };
  const signup = useCallback(
    async (data) => {
      try {
        setCode((prev) => {
          return { ...prev, email: data.email, data: data };
        });
        await UserService.signup({ ...data, ...additionInfo });
        setMode(2);
      } catch (error) {
        error.response &&
          PopupSubject.next({
            type: "WARN",
            message: error.response
              ? error.response.data
              : "Some errors occured",
            showTime: 5,
          });
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
  console.log(getValues());
  if (mode === 1)
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
              required
              inputRef={register({
                ...VALIDATOR.EMAIL.REQUIRED,
                ...VALIDATOR.EMAIL.PARTTERN,
              })}
              error={errors.email ? errors.email.message : null}
            />
            <TextField
              label="First Name"
              fullWidth
              variant="outlined"
              style={{ marginBottom: "1rem" }}
              className="no-pad"
              name="firstname"
              required
              inputRef={register({
                ...VALIDATOR.NAME.REQUIRED.FIRST,
                ...VALIDATOR.NAME.MINLENGTH,
              })}
              error={errors.firstname ? errors.firstname.message : null}
            />
            <TextField
              label="Last Name"
              fullWidth
              variant="outlined"
              style={{ marginBottom: "1rem" }}
              className="no-pad"
              name="lastname"
              required
              inputRef={register({
                ...VALIDATOR.NAME.REQUIRED.LAST,
                ...VALIDATOR.NAME.MINLENGTH,
              })}
              error={errors.lastname ? errors.lastname.message : null}
            />
            <DateTimePicker
              label="Birthday"
              fullWidth
              variant="outlined"
              type="date"
              className="no-pad"
              name="birthday"
              onlyDate={true}
              InputLabelProps={{
                shrink: true,
              }}
              disableFuture
              value={additionInfo.birthday}
              format="yyyy-MM-dd"
              onChange={(date) => {
                console.log(moment(date).format("YYYY-MM-DD"));
                setAdditionInfo((prev) => {
                  return {
                    ...prev,
                    birthday: moment(date).format("YYYY-MM-DD"),
                  };
                });
              }}
              maxDate={new Date(new Date().setMonth(new Date().getMonth() - 60))
                .toLocaleDateString()
                .split("/")
                .filter((s) => s)
                .reverse()
                .join("-")}
              required
            />
            <TextField
              select
              variant="outlined"
              className="no-pad"
              label="Gender"
              required
              fullWidth
              value={additionInfo.gender}
              onChange={(e) => {
                setAdditionInfo((prev) => {
                  return { ...prev, gender: e.target.value };
                });
              }}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </TextField>
            <TextField
              type="password"
              label="Password"
              fullWidth
              variant="outlined"
              // style={{ marginBottom: "1rem" }}
              className="no-pad"
              name="password"
              required
              inputRef={register({
                ...VALIDATOR.PASSWORD,
              })}
              error={errors.password ? errors.password.message : null}
            />
            <TextField
              type="password"
              label="RePassword"
              fullWidth
              variant="outlined"
              style={{ marginBottom: "1rem" }}
              className="no-pad"
              name="repassword"
              required
              inputRef={register({
                ...VALIDATOR.PASSWORD,
                validate: (value) =>
                  value === watch("password") || "2 passwords must be the same",
              })}
              error={errors.repassword ? errors.repassword.message : null}
            />
          </CardContent>

          <CardActions className="no-pad">
            <Button
              disabled={!formState.isValid || !additionInfo.birthday}
              type="submit"
              className="signupform__button"
            >
              Signup
            </Button>
          </CardActions>
          <br />
          <WithGoogleBtn className="signupform__button" />
        </form>
      </Card>
    );
  if (mode === 2) {
    return (
      <Card
        className="signup"
        style={{ borderRadius: ".6rem", backgroundColor: "red" }}
      >
        {props.header}
        <h3>
          A email has been sent to your email:{" "}
          <span className="email-verify">{code.email}</span>! Enter code to box
          below
        </h3>
        <TextField
          onChange={(e) => {
            console.log(e.target.value);
            setCode((prev) => {
              return { ...prev, code: e.target.value };
            });
          }}
          value={code.code}
          fullWidth
        />
        <Button
          onClick={(e) => {
            sendCode();
          }}
          className="signupform__button no-pad"
        >
          Confirm
        </Button>
      </Card>
    );
  }
};

export default SignUpForm;
