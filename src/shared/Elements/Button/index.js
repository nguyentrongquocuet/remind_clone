import React from "react";
import { Link } from "react-router-dom";
import { Button as MUiButton } from "@material-ui/core/";
import { styled } from "@material-ui/core/styles";
import "./Button.css";
const Button = (props) => {
  const StyledButton = styled(MUiButton)({
    ...props.style,
  });
  if (props.to) {
    return (
      <Link
        type={props.type}
        style={{ ...props.style, color: props.default ? "white" : "none" }}
        className={`button ${props.className}`}
        to={props.to}
      >
        {props.children}
      </Link>
    );
  }
  return (
    <StyledButton
      // style={props.style}
      type={props.type}
      className={`button ${props.className}`}
      onClick={props.onClick}
      color={props.color}
      style={{ ...props.style, color: props.default ? "white" : "none" }}
    >
      {props.children}
    </StyledButton>
  );
};

export default Button;
