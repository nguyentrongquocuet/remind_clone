import React from "react";
import { NavLink } from "react-router-dom";
import "./ClassItem.scss";
const ClassItem = ({ icon, id, name, onClick }) => {
  return (
    <NavLink
      to={`/classes/${id}`}
      onClick={onClick}
      className="sidebar__element__e classitem"
      activeClassName="item--active"
    >
      <img
        className="small circle"
        src={
          icon ||
          "https://remind.imgix.net/2e24f4f6-1f7e-4dad-aab9-94f69e462d45/math.svg"
        }
        alt={name}
      />
      <p>{name}</p>
    </NavLink>
  );
};

export default ClassItem;
