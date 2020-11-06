import { Avatar } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import { NavLink } from "react-router-dom";
import "./MesItem.scss";
const MessItem = ({
  avatar,
  path,
  name,
  onClick,
  message,
  time,
  // active,
  ...props
}) => {
  console.log("path", path);
  const history = useHistory();
  console.log("history", props.history);
  return (
    <NavLink
      to={`/classes/${path}`}
      onClick={onClick}
      className="sidebar__part__e classitem"
      activeClassName={"item--active"}
    >
      <Avatar
        src={
          avatar ||
          "https://remind.imgix.net/2e24f4f6-1f7e-4dad-aab9-94f69e462d45/math.svg"
        }
        className="medium "
        alt={name}
      ></Avatar>
      <div title={name} className="messitem">
        <span className="break-word-ellipsis">{name}</span>
        <span className="break-word-ellipsis">{message}</span>
      </div>
    </NavLink>
  );
};

export default MessItem;
