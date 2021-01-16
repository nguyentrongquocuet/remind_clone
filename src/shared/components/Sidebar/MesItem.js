import { Avatar } from "@material-ui/core";
// import { Button } from "bootstrap";
import React from "react";
import { NavLink } from "react-router-dom";
import Button from "shared/Elements/Button";
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
      // onClick={onClick}
      className={`sidebar__part__e classitem ${unread && "unread"}`}
      activeClassName={"item--active"}
    >
      <Avatar src={avatar} className="medium " alt={name}></Avatar>
      <div title={name} className="messitem">
        <span className="break-word-ellipsis">{name}</span>
        <span className="break-word-ellipsis">{message}</span>
      </div>
      {owner && (
        <img className="class-owner-icon tiny" src="/Assets/crown.svg" />
      )}
      {onClick && (
        <Button className="join-button" size="small" onClick={onClick}>
          Join
        </Button>
      )}
    </NavLink>
  );
};

export default MessItem;
