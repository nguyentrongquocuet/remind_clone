import React from "react";
import "./Main.scss";
const Main = (props) => {
  return (
    <div className="main__main">
      <header className="main__main__header">{props.header}</header>
      {props.children}
    </div>
  );
};

export default Main;
