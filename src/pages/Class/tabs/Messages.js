import React, { useState } from "react";
import Main from "../../../shared/components/Main/index.js";
import Sidebar from "../../../shared/components/Sidebar/index.js";
import SidebarPart from "../../../shared/components/Sidebar/SidebarPart";
import TextField from "../../../shared/Elements/TextField";
import Button from "../../../shared/Elements/Button";
import "./Messages.js";
import ClassItem from "../../../shared/components/Sidebar/ClassItem.js";
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
        <ClassItem key={c.id} name={c.name} id={c.id} />
      ))}
      {/* <ClassItem name="hello"></ClassItem> */}
    </>
  );
  const parts = (
    <SidebarPart
      header={
        <p className="sidebar__element__header uppercase">ANNOUNCEMENTS</p>
      }
      main={main}
    />
  );
  const header = (
    <>
      <TextField
        onChange={(e) => {
          setSearchQuery(e.target.value);
        }}
        text="Search"
        placeholder="search"
      />
      <Button style={{ padding: ".3rem .5rem", fontSize: "13px" }}>
        {" "}
        Search
      </Button>
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
