import React from "react";

import "./Hamburger.scss";
const Hamburger = (props) => {
  return (
    <p className={`hamburger ${props.className}`} onClick={props.onClick}>
      <span className="hamburger__slice"></span>
      <span className="hamburger__slice"></span>
      <span className="hamburger__slice"></span>
    </p>
  );
};

export default Hamburger;
