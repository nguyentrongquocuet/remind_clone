import { Avatar } from "@material-ui/core";
import React from "react";
import { NavLink } from "react-router-dom";
import "./MesItem.scss";
const MessItem = ({
  avatar,
  path,
  name,
  onClick,
  message,
  // active,
  unread,
  owner = false,
  ...props
}) => {
  return (
    <NavLink
      to={path ? `/classes/${path}` : "#"}
      onClick={onClick}
      className={`sidebar__part__e classitem ${unread && "unread"}`}
      activeClassName={"item--active"}
    >
      <Avatar src={avatar} className="medium " alt={name}></Avatar>
      <div title={name} className="messitem">
        <span className="break-word-ellipsis">{name}</span>
        <span className="break-word-ellipsis">{message}</span>
      </div>
      {owner && <img className="class-owner-icon small" src="/crown.svg" />}
    </NavLink>
  );
};

export default MessItem;
