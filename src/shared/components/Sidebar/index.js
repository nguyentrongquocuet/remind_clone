import React from "react";

import "./Sidebar.scss";

const Sidebar = ({ header, parts, classNames }) => {
  return (
    <aside className={`${classNames ? classNames.wrapper : ""}`}>
      <header className={`${classNames ? classNames.header : ""} `}>
        {header}
      </header>
      <main className="sidebar__main__scroll">{parts}</main>
    </aside>
  );
};

export default Sidebar;
