import React, { useState } from "react";
import Main from "../../../shared/components/Main/index.js";
import Sidebar from "../../../shared/components/Sidebar/index.js";
import SidebarPart from "../../../shared/components/Sidebar/SidebarPart";
import TextField from "../../../shared/Elements/TextField";
import Button from "../../../shared/Elements/Button";
import CreateIcon from "@material-ui/icons/Create";
import ClassItem from "../../../shared/components/Sidebar/ClassItem.js";
import "./Messages.scss";
import MessItem from "../../../shared/components/Sidebar/MesItem.js";

const dummyClasses = [
  {
    id: 1,
    name: "quoc1",
  },
  {
    id: 2,
    name: "quoc2",
  },
];
const Messages = (props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const main = (
    <>
      {/* <div className="sidebar__element__e action">
        <div className="small divbutton circle">+</div>
        <span> Create a class</span>
      </div> */}
      {dummyClasses.map((c) => (
        <MessItem
          key={c.id}
          name={c.name}
          path={`${c.id}Hello`}
          message="hello"
          time={new Date()}
        />
      ))}
      {/* <ClassItem name="hello"></ClassItem> */}
    </>
  );
  const parts = (
    <SidebarPart
      header={<p className="sidebar__part__header uppercase">ANNOUNCEMENTS</p>}
      main={main}
    />
  );
  const header = (
    <>
      <div className="user-search">
        <TextField
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
          text="Search"
          placeholder="Search"
        />
        <Button style={{ padding: ".5rem .5rem", fontSize: "13px" }}>
          <CreateIcon />
        </Button>
      </div>
    </>
  );
  return (
    <>
      <Sidebar
        header={header}
        classNames={{
          wrapper: "messages__sidebar",
          header: "messages__sidebar__header",
        }}
        parts={parts}
      >
        HELLO
      </Sidebar>
      <Main>Main</Main>
    </>
  );
};

export default Messages;
