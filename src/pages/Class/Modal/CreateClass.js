import React from "react";
import TextField from "../../../shared/Elements/TextField";
import Button from "../../../shared/Elements/Button";
import "./CreateClass.scss";
const CreateClass = ({ onClose }) => {
  return (
    <div className="createclass__wrapper">
      <header className="createclass__header">Create Class</header>
      <main className="createclass__main">
        <div className="pickicon">
          <div className="pickicon__preview"></div>
          <span>Edit Icon</span>
        </div>
        <div className="createclass__info">
          <TextField placeholder="Enter your class name <3" />
        </div>
      </main>
      <footer className="createclass__footer">
        <Button>Create </Button>
      </footer>
    </div>
  );
};

export default CreateClass;
