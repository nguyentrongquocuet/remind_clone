import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import {
  CardActions,
  CardContent,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import Button from "../../../../shared/Elements/Button";
import Card from "../../../../shared/Elements/Card";
import DateTimePicker from "../../../../shared/Elements/DateTimePicker";
import TextField from "../../../../shared/Elements/TextField";
import PopupSubject from "../../../../shared/Util/PopupSubject";
import AdminService from "../../../../services/AdminService";
import moment from "moment";
import VALIDATOR from "../../../../shared/Util/Validator";
// import d from "../../../../services"
import "./NewUser.scss";
import ROLE from "../../../../shared/Util/ROLE";
const NewUser = ({
  initialMode = "create",
  initialUserData,
  onSuccess,
  onUndo,
  ...props
}) => {
  const {
    register,
    handleSubmit,
    watch,
    errors,
    formState,
    getValues,
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: initialUserData ? initialUserData.email : "",
      firstname: initialUserData ? initialUserData.firstName : "",
      lastname: initialUserData ? initialUserData.lastName : "",
      password: initialUserData ? initialUserData.password : "",
      repassword: initialUserData ? initialUserData.password : "",
    },
    reValidateMode: "onChange",
  });
  const [mode, setMode] = useState(1);
  // const [code, setCode] = useState({ code: "", email: "", data: null });
  const [additionInfo, setAdditionInfo] = useState(() => {
    return {
      birthday: initialUserData
        ? moment(initialUserData.birthday).format("YYYY-MM-DD")
        : null,
      gender: initialUserData ? initialUserData.gender : "Male",
      role: initialUserData ? initialUserData.role : null,
      isVerified: initialUserData ? initialUserData.verified : null,
    };
  });
  const submit = useCallback(
    async (data) => {
      try {
        // setCode((prev) => {
        //   return { ...prev, email: data.email, data: data };
        // });
        initialMode === "create"
          ? await AdminService.createUser({ ...data, ...additionInfo })
          : await AdminService.modifyUser({
              ...data,
              ...additionInfo,
              id: initialUserData.id,
            });
        reset();
        onSuccess && onSuccess();
        PopupSubject.next({
          type: "SUCCESS",
          message:
            initialMode === "create"
              ? "you've created new user"
              : "you've modified this user",
          showTime: 5,
        });
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
  // const editUserInfo = (data) => {

  //   console.log(data, additionInfo);
  // };
  const onSubmit = (data, e) => {
    e.preventDefault();
    submit(data);
    // console.log("CHECK_DATA", data);
    // initialMode === "create" ? signup(data) : editUserInfo(data);
  };
  console.log(additionInfo);
  if (mode === 1)
    return (
      <Card className="signup">
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
              helperText={errors.email ? errors.email.message : null}
              error={Boolean(errors.email)}
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
              helperText={errors.firstname ? errors.firstname.message : null}
              error={Boolean(errors.firstname)}
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
              helperText={errors.lastname ? errors.lastname.message : null}
              error={Boolean(errors.lastname)}
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
              helperText={errors.password ? errors.password.message : null}
              error={Boolean(errors.password)}
            />
            <TextField
              type="password"
              label="Retype password"
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
              helperText={errors.repassword ? errors.repassword.message : null}
              error={Boolean(errors.repassword)}
            />
            <TextField
              select
              value={additionInfo.role === null ? -1 : additionInfo.role}
              name="role"
              onChange={(e) => {
                setAdditionInfo((prev) => {
                  return {
                    ...prev,
                    role: e.target.value >= 0 ? e.target.value : null,
                  };
                });
              }}
              label="Choose Role"
            >
              <MenuItem value={-1}>None</MenuItem>
              <MenuItem value={0}>{ROLE[0]}</MenuItem>
              <MenuItem value={1}>{ROLE[1]}</MenuItem>
              <MenuItem value={2}>{ROLE[2]}</MenuItem>
            </TextField>
            <FormControlLabel
              label="Verified"
              control={
                <Checkbox
                  checked={Boolean(additionInfo.isVerified)}
                  onChange={(e) =>
                    setAdditionInfo((prev) => {
                      return {
                        ...prev,
                        isVerified: e.target.checked ? true : null,
                      };
                    })
                  }
                />
              }
            />
          </CardContent>

          <CardActions className="no-pad">
            <Button
              disabled={!formState.isValid || !additionInfo.birthday}
              type="submit"
              className="signupform__button"
              size="small"
            >
              {initialMode === "create" ? "Create" : "Apply Change"}
            </Button>
            <Button
              variant="outlined"
              size="small"
              className="modify-undo"
              onClick={onUndo}
            >
              Cancel
            </Button>
          </CardActions>
          <br />
        </form>
      </Card>
    );
};

export default NewUser;
