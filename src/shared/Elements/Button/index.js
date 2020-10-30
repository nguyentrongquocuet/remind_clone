import React from "react";
import { Button as MUiButton } from "@material-ui/core/";
import { styled } from "@material-ui/core/styles";
import "./Button.scss";
const Button = (props) => {
  const StyledButton = styled(MUiButton)({
    ...props.style,
  });
  if (props.href) {
    return (
      <StyledButton
        {...props}
        type={props.type}
        style={{ ...props.style, color: props.default ? "white" : "none" }}
        className={`button ${props.className}`}
        href={props.href}
      >
        {props.children}
      </StyledButton>
    );
  }
  return (
    <StyledButton
      // style={props.style}
      {...props}
      type={props.type}
      className={`button ${props.className}`}
      onClick={props.onClick}
      color={props.color}
      style={{
        ...props.style,
        color: props.default ? "white" : "none",
      }}
    >
      {props.children}
    </StyledButton>
  );
};

export default Button;
