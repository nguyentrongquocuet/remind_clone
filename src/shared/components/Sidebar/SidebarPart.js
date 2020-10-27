import React from "react";
import "./SidebarPart.scss";
const SidebarElement = (props) => {
  return (
    <div className="sidebar__element">
      <header>{props.header}</header>
      <main>{props.main}</main>
    </div>
  );
};

export default SidebarElement;
