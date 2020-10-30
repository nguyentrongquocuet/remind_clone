import React, { useState } from "react";
import "./Message.scss";
import Popper from "../Popper";
const Message = ({ sender, content, type, time }) => {
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
  const open = Boolean(anchorEl) && type === "receiver";
  const popper = (
    <Popper
      width="fit-content"
      className="secondary"
      // id={id}
      open={open}
      anchorEl={anchorEl}
      placement="top-start"
    >
      <div
        className="popper__element"
        // onClick={() => {
        //   // logout();
        //   // history.push("/");
        // }}
        style={{ cursor: "pointer", marginLeft: ".5rem" }}
      >
        {sender.name}
        {/* {time || "now"} */}
      </div>
    </Popper>
  );
  const text = content
    .trim()
    .split(/[\n]+/)
    .map((w) => (
      <>
        <span>{w}</span> <br />
      </>
    ));
  return (
    <div
      onMouseLeave={(e) => {
        handleClick("off", e);
      }}
      onMouseOver={(e) => {
        handleClick("on", e);
      }}
      className={`message  ${type || ""}`}
    >
      {type === "announcement" && (
        <header className="message__header">
          <img
            src={
              sender.avatar ||
              "https://remind.imgix.net/2e24f4f6-1f7e-4dad-aab9-94f69e462d45/math.svg"
            }
            alt="message"
            className={`alter-avatar small`}
          />
          <span>{sender.name}</span>
        </header>
      )}
      <div className="message__content">
        <p>{text}</p>
      </div>
      {popper}
    </div>
  );
};

export default Message;
