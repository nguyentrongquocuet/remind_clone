import React from "react";
import InputBase from "@material-ui/core/InputBase";
import "./CustomTextField.scss";
const CustomTextField = ({ type, onKeyUp, value, onChange, placeholder }) => {
  // if (type === "textarea")
  // return (
  //   <textarea
  //     onKeyUp={onKeyUp ? (e) => onKeyUp(e) : (e) => e.preventDefault()}
  //     className="input__textarea"
  //     value={value}
  //     onChange={
  //       onChange
  //         ? (e) => {
  //             onChange(e);
  //           }
  //         : (e) => e.preventDefault()
  //     }
  //     placeholder={placeholder || ""}
  //   />
  // );
  return (
    <InputBase
      onKeyUp={onKeyUp ? (e) => onKeyUp(e) : (e) => e.preventDefault()}
      classes={{
        input: "input",
        root: "input__wrapper",
      }}
      value={value}
      onChange={
        onChange
          ? (e) => {
              onChange(e);
            }
          : (e) => e.preventDefault()
      }
      placeholder={placeholder || ""}
      multiline={type === "textarea"}
      rows={type === "textarea" ? "2" : "0"}
    />
  );
};

export default CustomTextField;
