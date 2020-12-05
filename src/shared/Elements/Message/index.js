import React, { useState, useContext, useLayoutEffect } from "react";
import "./Message.scss";
import Popper from "../Popper";
import useLazy from "../../Util/lazy-hook";
import { Context } from "../../Util/context";
import { Avatar } from "@material-ui/core";
import AttachFilePreview from "../AttachFilePreview";
import localTime from "../../Util/convertToLocaleTime";
import ModalSubject from "../../Util/ModalSubject";
const Message = ({ message, senderData, onPreview, classAvatar }) => {
  const [ref, visible] = useLazy(
    () => {
      ref.current.src = ref.current.getAttribute("data-src");
    },
    {
      root: document.getElementsByClassName("allmessages")[0],
      rootMargin: "0px 0px 100px 0px",
    }
  );
  const userId = useContext(Context).globalState.userData.id;
  const own = message.senderId == userId;

  // if(content.type==="text")
  const [anchorEl, setAnchorEl] = useState(null);
  useLayoutEffect(() => {
    if (message.type === 1) {
      const messElement = document.getElementById(`message${message.id}`);
      if (messElement) {
        const aTags = document.querySelectorAll(
          "#" + messElement.getAttribute("id") + " " + "a"
        );
        for (const a of aTags) {
          a.setAttribute("target", "_blank");
        }
        messElement.innerHTML = message.content;
      }
    }
  }, [message]);
  const handleClick = (type, event) => {
    event.preventDefault();
    if (type === "off") {
      if (anchorEl) setAnchorEl(null);
    } else {
      if (!anchorEl) setAnchorEl(event.currentTarget);
    }
  };
  const open = Boolean(anchorEl);
  // CAN USE FOR MESSAGE REACTING
  const popper = (
    <Popper
      width="fit-content"
      className="secondary"
      // id={id}
      open={open}
      anchorEl={anchorEl}
      placement={own ? "left" : "right"}
    >
      <div
        onClick={(e) =>
          ModalSubject.next({
            type: "VIEW_PEOPLE",
            data: {
              event: e,
              userId: senderData.id,
            },
          })
        }
        className="popper__element"
        style={{
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          width: "120%",
          position: "relative",
          left: "-.5rem",
        }}
      >
        {!own && <p>{senderData ? senderData.name : "dummy"}</p>}
        <p>{localTime(message.createAt) || "now"}</p>
      </div>
    </Popper>
  );

  const text =
    message.content.length > 0
      ? message.content
          .trim()
          .split(/[\n]+/)
          .map((w, index) => (
            <span key={index}>
              {w} <br />
            </span>
          ))
      : null;
  if (message.type === 0) {
    const normalMessage = text ? (
      <>
        <div className="message__content">
          <p>{text}</p>
        </div>
      </>
    ) : null;

    return (
      <div
        onMouseLeave={(e) => {
          handleClick("off", e);
        }}
        onMouseOver={(e) => {
          handleClick("on", e);
        }}
        className={`message ${own ? "owner" : ""}`}
      >
        {normalMessage}
        {message.file && (
          <div ref={ref}>
            <AttachFilePreview
              // imgRef={ref}
              onClick={onPreview}
              className="image"
              fileUrl={message.file}
              visible={visible}
            />
          </div>
        )}

        {popper}
      </div>
    );
  }

  return (
    <div
      onMouseLeave={(e) => {
        handleClick("off", e);
      }}
      onMouseOver={(e) => {
        handleClick("on", e);
      }}
      className={`announcement ${own ? "owner" : ""}`}
    >
      <header className="announcement__header">
        <Avatar
          className="alter-avatar small"
          alt="message"
          src={
            classAvatar ||
            "https://remind.imgix.net/2e24f4f6-1f7e-4dad-aab9-94f69e462d45/math.svg"
          }
        >
          VL
        </Avatar>
        <div className="announcement-info">
          <span>{senderData ? senderData.name : "Loading..."}</span>
          <span className="announcement-target">{message.target}</span>
        </div>
      </header>
      <div className="announcement__content">
        <div
          id={`message${message.id}`}
          className="content"
          style={{
            marginLeft: ".5rem",
            wordBreak: "break-word",
            cursor: "default",
          }}
        >
          {/* {message.content} */}
        </div>
        {message.file && (
          <div ref={ref}>
            <AttachFilePreview
              // imgRef={ref}
              onClick={onPreview}
              className="image"
              fileUrl={message.file}
              visible={visible}
            />
          </div>
        )}
      </div>
      {popper}
    </div>
  );
};

export default Message;
