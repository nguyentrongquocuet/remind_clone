import React from "react";
import Textfield from "@material-ui/core/Textfield";
import "./CustomTextField.scss";
const CustomTextField = ({
  type,
  onKeyUp,
  value,
  variant,
  onChange,
  placeholder,
  custom,
  className,
  rows,
  inputProps,
  ...props
}) => {
  return (
    <Textfield
      {...props}
      inputProps={inputProps}
      type={type || "input"}
      onKeyUp={onKeyUp ? (e) => onKeyUp(e) : (e) => e.preventDefault()}
      classes={{
        // input: `input ${!custom ? "default" : ""}`,
        root: `input__wrapper ${!custom ? "default" : ""}`,
      }}
      className={`${className} ${!custom ? "default" : ""}`}
      value={value}
      variant={variant || "outlined"}
      onChange={
        onChange
          ? (e) => {
              onChange(e);
            }
          : (e) => e.preventDefault()
      }
      placeholder={placeholder || ""}
      multiline={type === "textarea"}
      rows={rows || "2"}
      rowsMax={rows}
    />
  );
};

export default CustomTextField;
