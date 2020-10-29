import React from "react";
import { NavLink } from "react-router-dom";
import "./MesItem.scss";
const MessItem = ({ avatar, path, name, onClick, message, time }) => {
  return (
    <NavLink
      to={`${path}`}
      onClick={onClick}
      className="sidebar__part__e classitem"
      activeClassName="item--active"
    >
      <img
        className="medium circle"
        src={
          avatar ||
          "https://remind.imgix.net/2e24f4f6-1f7e-4dad-aab9-94f69e462d45/math.svg"
        }
        alt={name}
      />
      <div className="message">
        <span>{name}</span>
        <span>{message}</span>
      </div>
    </NavLink>
  );
};

export default MessItem;
