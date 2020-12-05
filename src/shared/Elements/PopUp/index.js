import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import ErrorIcon from "@material-ui/icons/Error";
import CheckIcon from "@material-ui/icons/Check";
import WarningRoundedIcon from "@material-ui/icons/WarningRounded";
import NewReleasesRoundedIcon from "@material-ui/icons/NewReleasesRounded";
import Button from "../Button";
import Modal from "../Modal";
import "./PopUp.scss";
const PopUp = ({ onClick, onClose, className, content }) => {
  useEffect(() => {
    if (content.showTime) {
      const timeOut = setTimeout(() => onClose(), content.showTime * 1000);
    }
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
    case "CONFIRM":
      body = (
        <>
          <Modal
            disableAutoFocus={false}
            disableEnforceFocus={false}
            classNames={{
              wrapper: "center",
              content: "confirm form__modal",
            }}
            open={Boolean(content)}
            onClose={onClose}
          >
            <div className="confirm-message">
              <p>{content.message}</p>
            </div>
            <div className="confirm-choice">
              {content.choices && content.choices.length > 0 ? (
                content.choices.map((choice, k) => (
                  <Button key={k} onClick={choice.action} color="primary">
                    {choice.text}
                  </Button>
                ))
              ) : (
                <>
                  <Button
                    onClick={(e) => {
                      if (content.onConfirm) {
                        content.onConfirm(e);
                        onClose(e);
                      }
                    }}
                    color="secondary"
                  >
                    Confirm
                  </Button>
                  <Button
                    onClick={
                      content.onCancel ? content.onCancel : (e) => onClose()
                    }
                    color="primary"
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </Modal>
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
      style={
        content.showTime
          ? {
              animation: "popup ease forwards",
              animationDuration: content.showTime + "s" || "3s",
            }
          : {
              display: "none",
              opacity: 1,
            }
      }
      className={`${className || ""} popup ${content.type.toLowerCase()}`}
    >
      {body}
    </div>,
    document.getElementById("popup-hook")
  );
};

export default PopUp;
