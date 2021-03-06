import React from "react";
import { NavLink, useParams } from "react-router-dom";
import "./HeaderNav.scss";
const HeaderNav = ({ elements, className }) => {
  const params = useParams();
  return (
    <div className={`nav ${className}`}>
      {elements.map((e) => {
        if (e.tod)
          return (
            <NavLink
              key={e.to}
              exact
              // activeClassName={"boxlink--active"}
              className={`nav__link uppercase secondary ${e.className || " "} ${
                e.active ? "boxlink--active" : ""
              }`}
              to={e.to ? `/classes/${params.classId}/${e.to}` : "#"}
              onClick={(event) => {
                e.onClick ? e.onClick(event) : event.preventDefault();
              }}
            >
              {e.text}
            </NavLink>
          );
        else {
          return (
            <span
              key={e.text}
              className={`nav__link uppercase secondary ${e.className || " "} ${
                e.active ? "boxlink--active" : ""
              }`}
              onClick={(event) => {
                e.onClick ? e.onClick(event) : event.preventDefault();
              }}
            >
              {e.text}
            </span>
          );
        }
      })}
    </div>
  );
};

export default HeaderNav;
