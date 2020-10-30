import React, { useState, useEffect } from "react";
import TextField from "../../../shared/Elements/TextField";
import "./Messages.scss";
import Message from "../../../shared/Elements/Message";
import Button from "../../../shared/Elements/Button";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import SendIcon from "@material-ui/icons/Send";
let dummyClasses = [
  {
    id: 1,
    name: "quoc1",
    type: "receiver",
  },
  {
    id: 2,
    name: "quoc2",
    type: "sender",
  },
  {
    id: 3,
    name: "quoc2",
    type: "sender",
  },
  {
    id: 4,
    name: "quoc2",
    type: "sender",
  },
  {
    id: 5,
    name: "quoc2",
    type: "sender",
  },
  {
    id: 6,
    name: "quoc2",
    type: "sender",
  },
  {
    id: 7,
    name: "quoc2",
    type: "sender",
  },
  {
    id: 8,
    name: "quoc2",
    type: "sender",
  },
  {
    id: 9,
    name: "quoc2",
    type: "sender",
  },
  {
    id: 10,
    name: "quoc2",
    type: "sender",
  },
  {
    id: 11,
    name: "quoc2",
    type: "sender",
  },
  {
    id: 12,
    name: "quoc2",
    type: "sender",
  },
  // {
  //   id: 13,
  //   name: "quoc2",
  //   type: "sender",
  // },
  // {
  //   id: 14,
  //   name: "quoc2",
  //   type: "sender",
  // },
  // {
  //   id: 15,
  //   name: "quoc2",
  //   type: "sender",
  // },
  // {
  //   id: 16,
  //   name: "quoc2",
  //   type: "sender",
  // },
  // {
  //   id: 17,
  //   name: "quoc2",
  //   type: "sender",
  // },
  // {
  //   id: 18,
  //   name: "quoc2",
  //   type: "sender",
  // },
];
const Messages = (props) => {
  const [messagesState, setMessages] = useState(dummyClasses);
  const [message, setMessage] = useState("");
  const sendMessage = () => {
    console.log(message);
    setMessages((prev) => [
      ...prev,
      {
        id: 3,
        name: "qupc1",
        type: "sender",
        content: message,
      },
    ]);
    setMessage("");
  };
  useEffect(() => {
    let ms = document.getElementsByClassName("allmessages")[0];
    ms.scrollTop = ms.scrollHeight;
  }, [messagesState]);
  const messages = (
    <>
      <div className="messages__wrapper">
        <div className="fix" style={{ flex: "1" }}></div>
        <div className="allmessages">
          {messagesState.map((c) => (
            <Message
              sender={{ name: c.name }}
              key={c.id}
              name={c.name}
              path={`${c.id}Hello`}
              message="hello"
              time={new Date()}
              content={c.content || "Dsdjasdjjdajkdakdksa"}
              type={c.type}
            />
          ))}
        </div>

        <div className="message__input">
          <TextField
            type="textarea"
            placeholder="send messages"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            onKeyUp={(e) =>
              e.key === "Enter" ? e.preventDefault() : e.preventDefault()
            }
          />
          <input
            style={{ display: "none" }}
            type="file"
            name="file"
            id="file"
          />
          <AttachFileIcon
            onClick={(e) => document.getElementById("file").click()}
            color="primary"
          />
          <SendIcon
            onClick={(e) => {
              sendMessage();
            }}
            color="primary"
          />
        </div>
      </div>

      {/* <ClassItem name="hello"></ClassItem> */}
    </>
  );

  return <>{messages}</>;
};

export default Messages;
