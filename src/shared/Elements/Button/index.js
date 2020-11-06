import React from "react";
import { Button as MUiButton } from "@material-ui/core/";
import "./Button.scss";
const Button = (props) => {
  return (
    <MUiButton
      {...props}
      type={props.type}
      // style={{ ...props.style}}
      className={`${props.className}`}
      href={props.href}
      onClick={props.onClick}
      color={props.color || "primary"}
      variant={props.variant || "contained"}
      disabled={props.disabled}
    >
      {props.children}
    </MUiButton>
  );
};

export default Button;
