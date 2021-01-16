import { Avatar } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import UserService from "services/UserService";
import Button from "shared/Elements/Button";
import Card from "shared/Elements/Card";
import TextField from "shared/Elements/TextField";
import PopupSubject from "shared/Util/PopupSubject";
import Validator from "shared/Util/Validator";
import Loading from "../Loading";
import PickupAvatar from "../PickupAvatar";
import "./UserSetting.scss";
const UserSetting = () => {
  const [userData, setUserData] = useState({
    info: null,
    relationships: null,
  });

  const [newAvatar, setNewAvatar] = useState({
    file: null,
    dirty: false,
  });

  const { register, watch, errors, handleSubmit } = useForm({
    mode: "onSubmit",
    defaultValues: {
      newpass: "",
      retypepass: "",
    },
    reValidateMode: "onSubmit",
  });

  const {
    register: register2,
    errors: errors2,
    handleSubmit: handleSubmit2,
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const onUndoChooseAvatar = () => {
    setNewAvatar({
      file: null,
      dirty: false,
    });
  };

  const onRemoveAvatar = () => {
    setNewAvatar({
      file: null,
      dirty: true,
    });
  };

  const getInfo = () =>
    UserService.getMyFullInfo().then(({ data }) => {
      setUserData(data);
    });
  useEffect(() => {
    getInfo();
  }, []);

  const onChangeAvatar = (file) => {
    setNewAvatar({ file, dirty: true });
  };

  const submitRegularInfo = (data) => {
    const { lastname, firstname } = data;
    const avatar = userData.info.avatar;
    console.log("check-setting", data);
    const formData = new FormData();
    formData.append("firstname", firstname);
    formData.append("lastname", lastname);
    newAvatar.file
      ? formData.append("avatar", newAvatar, newAvatar.name)
      : !newAvatar.dirty && formData.append("avatar", avatar);
    UserService.changeUserInfo(formData);
  };

  const submitNewPassword = (data) => {
    UserService.changePasswordWithLogin(data);
  };

  const { info, relationships } = userData;

  const onRemoveRelationship = (id) => {
    PopupSubject.next({
      type: "CONFIRM",
      message: "Do you want to remove this relationship?",
      onConfirm: (e) => removeRelationship(id),
    });
  };

  const removeRelationship = (id) =>
    UserService.removeRelationship(id).then(() => {
      let relationships = userData.relationships;
      relationships.splice(
        userData.relationships.indexOf((e) => e.id === id),
        1
      );
      setUserData((prev) => {
        return { ...prev, relationships: [...relationships] };
      });
    });

  return (
    <Card className="user-setting">
      {info ? (
        <div className="flex f-column">
          <div className="flex f-column forms">
            <form
              onSubmit={handleSubmit2(submitRegularInfo)}
              className="flex f-column form"
            >
              <PickupAvatar
                defaultSrc={info.avatar}
                text="Choose your avatar"
                onChange={onChangeAvatar}
                onRemove={onRemoveAvatar}
                onUndo={onUndoChooseAvatar}
              />
              <p className="flex f-column f-v-sa">
                <span>{info.email}</span>
                <span className=" text-cap">{info.role}</span>
              </p>
              <p className="form-legend">Personal information</p>
              <div className="flex f-row">
                <TextField
                  defaultValue={info.firstName}
                  className="w-50"
                  label="First name"
                  name="firstname"
                  inputRef={register2({
                    ...Validator.NAME.REQUIRED.FIRST,
                    ...Validator.NAME.MINLENGTH,
                  })}
                  error={Boolean(errors2.firstname)}
                  helperText={
                    errors2.firstname
                      ? errors2.firstname
                        ? errors2.firstname.message
                        : null
                      : null
                  }
                />
                <TextField
                  defaultValue={info.lastName}
                  className="w-50"
                  label="Last name"
                  name="lastname"
                  inputRef={register2({
                    ...Validator.NAME.REQUIRED.LAST,
                    ...Validator.NAME.MINLENGTH,
                  })}
                  error={Boolean(errors2.lastname)}
                  helperText={
                    errors2.lastname
                      ? errors2.lastname
                        ? errors2.lastname.message
                        : null
                      : null
                  }
                />
              </div>
              <Button className="mar-t-50-rem" type="submit" size="small">
                Save
              </Button>
            </form>
            <p className="form-legend">Password</p>
            <form
              onSubmit={handleSubmit(submitNewPassword)}
              className="flex f-column form"
            >
              <div className="flex f-row">
                <TextField
                  inputRef={register({
                    ...Validator.PASSWORD,
                  })}
                  error={Boolean(errors.newpass)}
                  helperText={
                    errors.newpass
                      ? errors.newpass
                        ? errors.newpass.message
                        : null
                      : null
                  }
                  name="newpass"
                  className="w-50"
                  label="New password"
                />
                <TextField
                  name="retypepass"
                  className="w-50"
                  label="Retype password"
                  inputRef={register({
                    ...Validator.PASSWORD,
                    validate: (value) =>
                      value === watch("newpass") ||
                      "2 passwords must be the same",
                  })}
                  error={Boolean(errors.retypepass)}
                  helperText={
                    errors.retypepass
                      ? errors.retypepass
                        ? errors.retypepass.message
                        : null
                      : null
                  }
                />
              </div>
              <Button className="mar-t-50-rem" type="submit" size="small">
                Save
              </Button>
            </form>
          </div>
          <p>Your relationships</p>
          {relationships && (
            <div className="flex f-column fullwidth relationships">
              {relationships.length > 0
                ? relationships.map((user) => (
                    <div
                      key={user.id}
                      className="flex f-row f-v-c relationship"
                      onClick={(e) => onRemoveRelationship(user.id)}
                    >
                      <Avatar className="small" src={user.avatar} />
                      <span>{user.name}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-x "
                        viewBox="0 0 16 16"
                      >
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                      </svg>
                    </div>
                  ))
                : "No relationships"}
            </div>
          )}
        </div>
      ) : (
        <Loading />
      )}
    </Card>
  );
};

export default UserSetting;
