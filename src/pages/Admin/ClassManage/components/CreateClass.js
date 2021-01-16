import React, { useState } from "react";
import TextField from "shared/Elements/TextField";
import Button from "shared/Elements/Button";
import PopupSubject from "shared/Util/PopupSubject";
import PickupAvatar from "shared/components/PickupAvatar";
import AdminService from "services/AdminService";

import "./CreateClass.scss";
const CreateClass = ({ onClose }) => {
  const [classInfo, setClassInfo] = useState({
    classname: "",
    avatar: null,
  });
  console.log(classInfo);
  const createClass = async () => {
    try {
      const newClass = new FormData();
      newClass.append("className", classInfo.classname.trim());
      classInfo.avatar &&
        newClass.append("avatar", classInfo.avatar, classInfo.avatar.name);
      AdminService.createClass(newClass);
      onClose();
      PopupSubject.next({
        type: "SUCCESS",
        message: `You've created ${classInfo.classname}`,
        showTime: 5,
      });
    } catch (error) {}
  };
  const chooseAvatar = (file) => {
    setClassInfo((prev) => {
      return { ...prev, avatar: file };
    });
  };
  return (
    <div className="createclass__wrapper">
      <header className="createclass__header">Create Class</header>
      <main className="createclass__main">
        {/* <div className="pickicon">
          <div className="pickicon__preview"></div>
          <span>Edit Icon</span>
        </div> */}
        <PickupAvatar onChange={chooseAvatar} />
        <div className="createclass__info">
          <TextField
            onChange={(e) =>
              setClassInfo((prev) => {
                return { ...prev, classname: e.target.value };
              })
            }
            placeholder="Enter your class name <3"
          />
        </div>
      </main>
      <footer className=" flex f-h-c createclass__footer">
        <Button
          disabled={classInfo.classname === ""}
          onClick={(e) => {
            createClass();
          }}
        >
          Create{" "}
        </Button>
      </footer>
    </div>
  );
};

export default CreateClass;
