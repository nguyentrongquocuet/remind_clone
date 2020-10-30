import React, { useState } from "react";
import HeaderNav from "../../Elements/HeaderNav";
import TextField from "../../Elements/TextField";
import MessItem from "../Sidebar/MesItem";
import "./MessagePanel.scss";
const dummyClasses = [
  {
    id: 1,
    name: "quoc1",
  },
  {
    id: 3,
    name: "quoc3",
  },
  {
    id: 4,
    name: "quoc4",
  },
  {
    id: 5,
    name: "quoc5",
  },
];
const dummyClasses2 = [
  {
    id: 1,
    name: "quoc1",
  },
  {
    id: 3,
    name: "quoc3",
  },
  {
    id: 4,
    name: "quoc4",
  },
  {
    id: 5,
    name: "quoc5",
  },
  {
    id: 6,
    name: "quoc6",
  },
  {
    id: 7,
    name: "quoc7",
  },
  {
    id: 8,
    name: "quoc8",
  },
  {
    id: 9,
    name: "quoc9",
  },
  {
    id: 10,
    name: "quoc10",
  },
  {
    id: 11,
    name: "quoc11",
  },
];
const MessagePanel = () => {
  const [panelMode, setPanelMode] = useState(false);
  return (
    <div className="messages__panel">
      <HeaderNav
        elements={[
          {
            onClick: (e) => setPanelMode((prev) => !prev),
            text: "OWNED",
          },
          { onClick: (e) => setPanelMode((prev) => !prev), text: "JOINED" },
        ]}
      />
      <div className="user-search">
        <TextField
          onChange={(e) => {
            // setSearchQuery(e.target.value);
          }}
          text="Search"
          placeholder="Search"
        />
      </div>
      <div className="messages__list">
        {panelMode
          ? dummyClasses.map((c) => (
              <MessItem
                key={c.id}
                name={c.name}
                onClick={(e) => alert("open message")}
                message="hello wuoc"
                active={false}
              ></MessItem>
            ))
          : dummyClasses2.map((c) => (
              <MessItem
                key={c.id}
                name={c.name}
                onClick={(e) => alert("open message")}
                message="hello wuoc"
                active={false}
              ></MessItem>
            ))}
      </div>
    </div>
  );
};

export default MessagePanel;
