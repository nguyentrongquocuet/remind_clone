import React from "react";
import { NavLink } from "react-router-dom";
import "./HeaderNav.scss";
const HeaderNav = ({ elements }) => {
  return (
    <div className="nav">
      {elements.map((e) => (
        <NavLink
          key={e.to}
          exact
          activeClassName="boxlink--active"
          className="nav__link uppercase secondary"
          to={e.to || "#"}
        >
          {e.text}
        </NavLink>
      ))}
    </div>
  );
};

export default HeaderNav;
