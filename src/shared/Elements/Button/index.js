import React from "react";
import { Link } from "react-router-dom";
import "./Button.css";
const Button = (props) => {
  if (props.to) {
    return (
      <Link
        style={props.style}
        className={`button ${props.className}`}
        to={props.to}
      >
        {props.children}
      </Link>
    );
  }
  return (
    <button
      style={props.style}
      className={`button ${props.className}`}
      onClick={props.onClick || null}
    >
      {props.children}
    </button>
  );
};

export default Button;
