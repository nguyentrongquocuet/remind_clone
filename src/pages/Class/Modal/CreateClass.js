import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import TextField from "../../../shared/Elements/TextField";
import Button from "../../../shared/Elements/Button";
import ClassService from "../../../services/ClassService";
import { Context } from "../../../shared/Util/context";
import "./CreateClass.scss";
import PopupSubject from "../../../shared/Util/PopupSubject";
const CreateClass = ({ onClose }) => {
  const [className, setClassName] = useState("");
  const { dispatch } = useContext(Context);
  const history = useHistory();
  const createClass = async () => {
    try {
      const classData = await ClassService.createClass(className.trim());
      dispatch({ type: "ADD_CLASS", payload: classData.data });
      onClose();
      history.push(`/classes/${classData.data.classId}`);
    } catch (error) {
      PopupSubject.next({
        type: "ERROR",
        message: error.response ? error.response.data : "Some errors occured",
        showTime: 5,
      });
    }
  };
  return (
    <div className="createclass__wrapper">
      <header className="createclass__header">Create Class</header>
      <main className="createclass__main">
        <div className="pickicon">
          <div className="pickicon__preview"></div>
          <span>Edit Icon</span>
        </div>
        <div className="createclass__info">
          <TextField
            onChange={(e) => setClassName(e.target.value)}
            placeholder="Enter your class name <3"
          />
        </div>
      </main>
      <footer className="createclass__footer">
        <Button
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
