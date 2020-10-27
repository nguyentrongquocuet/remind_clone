import React from "react";
import InputBase from "@material-ui/core/InputBase";
import "./CustomTextField.scss";
const CustomTextField = (props) => {
  return (
    <InputBase
      classes={{
        input: "input",
        root: "input__wrapper",
      }}
      onChange={(e) => props.onChange(e)}
      placeholder={props.placeholder}
    />
  );
};

export default CustomTextField;
