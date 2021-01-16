import React, { useEffect, useState } from "react";
import Textfield from "@material-ui/core/Textfield";
import "./CustomTextField.scss";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
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
  size,
  inputProps,
  name,
  id,
  label,
  defaultValue,
  readonly,
  ...props
}) => {
  const [show, setShow] = React.useState(() =>
    type === "password" ? false : true
  );
  const [endAno, setEndAno] = useState(null);
  useEffect(() => {
    if (type === "password") {
      setEndAno(
        <InputAdornment position="end">
          <IconButton
            aria-label="toggle password visibility"
            onClick={(e) => setShow((p) => !p)}
            onMouseDown={(e) => e.preventDefault()}
          >
            {!show ? <Visibility /> : <VisibilityOff />}
          </IconButton>
        </InputAdornment>
      );
    }
  }, [show, type]);
  return (
    <Textfield
      {...props}
      name={name}
      id={id}
      inputProps={inputProps}
      type={show ? "text" : type || "input"}
      onKeyUp={onKeyUp ? (e) => onKeyUp(e) : (e) => e.preventDefault()}
      classes={{
        // input: `input ${!custom ? "default" : ""}`,
        root: `input__wrapper ${!custom ? "default" : ""}`,
      }}
      className={`${className} ${!custom ? "default" : ""}`}
      value={value}
      variant={variant || "outlined"}
      onChange={onChange ? onChange : (e) => e.preventDefault()}
      placeholder={placeholder || ""}
      multiline={type === "textarea"}
      rows={rows || "2"}
      rowsMax={rows}
      InputProps={{
        endAdornment: endAno,
      }}
      size={size || "small"}
      defaultValue={defaultValue}
      label={label}
      disabled={readonly}
    />
  );
};

export default CustomTextField;
