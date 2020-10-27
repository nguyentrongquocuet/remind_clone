import React from "react";

import "./Sidebar.scss";

const Sidebar = ({ header, parts, classNames }) => {
  return (
    <aside className={`${classNames ? classNames.wrapper : ""}`}>
      <header className={`${classNames ? classNames.header : ""} `}>
        {header}
      </header>
      <main>{parts}</main>
    </aside>
  );
};

export default Sidebar;
