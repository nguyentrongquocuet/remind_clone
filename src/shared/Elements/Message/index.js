import React, { useState, useContext } from "react";
import "./Message.scss";
import Popper from "../Popper";
import useLazy from "../../Util/lazy-hook";
import { Context } from "../../Util/context";
import { Avatar } from "@material-ui/core";
import AttachFilePreview from "../AttachFilePreview";
const Message = ({ message, senderData, onPreview }) => {
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
        className="popper__element"
        style={{
          cursor: "pointer",
          marginLeft: ".5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        {!own && <p>{senderData ? senderData.name : "dummy"}</p>}
        <p>
          {new Date(Date.parse(message.createAt)).toLocaleString() || "now"}
        </p>
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
    <div className={`announcement ${own ? "owner" : ""}`}>
      <header
        className="announcement__header"
        onMouseLeave={(e) => {
          handleClick("off", e);
        }}
        onMouseOver={(e) => {
          handleClick("on", e);
        }}
      >
        <Avatar
          className="alter-avatar small"
          alt="message"
          src={
            senderData
              ? senderData.avatar
                ? "https://remind.imgix.net/2e24f4f6-1f7e-4dad-aab9-94f69e462d45/math.svg"
                : ""
              : ""
          }
        >
          VL
        </Avatar>
        <span>{senderData ? senderData.name : "Loading..."}</span>
      </header>
      <div className="announcement__content">
        <p
          style={{
            marginLeft: ".5rem",
            wordBreak: "break-word",
            cursor: "default",
          }}
        >
          {message.content}
        </p>
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
