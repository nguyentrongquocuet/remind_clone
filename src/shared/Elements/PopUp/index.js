import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import ErrorIcon from "@material-ui/icons/Error";
import CheckIcon from "@material-ui/icons/Check";
import WarningRoundedIcon from "@material-ui/icons/WarningRounded";
import NewReleasesRoundedIcon from "@material-ui/icons/NewReleasesRounded";
import "./PopUp.scss";
const PopUp = ({ onClick, onClose, className, content }) => {
  useEffect(() => {
    const timeOut = setTimeout(() => onClose(), content.showTime * 1000);
    // return () => clearTimeout(timeOut);
  }, [content]);
  let body;
  switch (content.type) {
    case "ERROR":
      body = (
        <>
          <p>{content.message}</p>
          <ErrorIcon color="error" />
        </>
      );
      break;
    case "SUCCESS":
      body = (
        <>
          <p>{content.message}</p>
          <CheckIcon color="primary" />
        </>
      );
      break;
    case "WARN":
      body = (
        <>
          <p>{content.message}</p>
          <WarningRoundedIcon color="action" />
        </>
      );
      break;
    case "NEW":
    default:
      body = (
        <>
          <p>{content.message}</p>
          <NewReleasesRoundedIcon color="secondary" />
        </>
      );
      break;
  }
  return createPortal(
    <div
      style={{ animationDuration: content.showTime + "s" || "3s" }}
      className={`${className || ""} popup ${content.type.toLowerCase()}`}
    >
      {body}
    </div>,
    document.getElementById("popup-hook")
  );
};

export default PopUp;
