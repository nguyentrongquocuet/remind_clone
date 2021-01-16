import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import TextField from "../../../shared/Elements/TextField";
import Button from "../../../shared/Elements/Button";
import ClassService from "../../../services/ClassService";
import { Context } from "../../../shared/Util/context";
import "./CreateClass.scss";
import PopupSubject from "../../../shared/Util/PopupSubject";
import PickupAvatar from "../../../shared/components/PickupAvatar";
const CreateClass = ({ onClose }) => {
  const [classInfo, setClassInfo] = useState({
    classname: "",
    avatar: null,
  });
  const { dispatch } = useContext(Context);
  const history = useHistory();
  console.log(classInfo);
  const createClass = async () => {
    try {
      const newClass = new FormData();
      newClass.append("className", classInfo.classname.trim());
      classInfo.avatar &&
        newClass.append("avatar", classInfo.avatar, classInfo.avatar.name);
      const classData = await ClassService.createClass(newClass);
      dispatch({ type: "ADD_CLASS", payload: classData.data });
      onClose();
      // PopupSubject.next({
      //   type: "SUCCESS",
      //   message: `You've created ${classInfo.classname}`,
      //   showTime: 5,
      // });
      history.push(`/classes/${classData.data.classId}`);
    } catch (error) {
      PopupSubject.next({
        type: "WARN",
        message: error.response ? error.response.data : "Some errors occured",
        showTime: 5,
      });
    }
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
      <footer className="createclass__footer">
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
