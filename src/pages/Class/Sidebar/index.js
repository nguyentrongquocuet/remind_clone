import React, { useState, useContext } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Sidebar from "../../../shared/components/Sidebar";
import SidebarPart from "../../../shared/components/Sidebar/SidebarPart";
import ClassItem from "../../../shared/components/Sidebar/ClassItem";
import Popper from "../../../shared/Elements/Popper";
import { Context } from "../../../shared/Util/context";
const ClassSidebar = (props) => {
  let history = useHistory();
  const { logout, userData } = useContext(Context);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [dummyClasses] = useState([
    {
      id: 1,
      name: "quoc1",
    },
    {
      id: 2,
      name: "quoc2",
    },
  ]);
  const id = open ? "simple-popper" : undefined;
  const image = undefined;
  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const header = (
    <>
      <Link className="sidebar__header__avatar" to="/settings/profile">
        {image ? (
          <img src={image} alt="hell" />
        ) : (
          <div className="alter-avatar medium">TN</div>
        )}
      </Link>
      <div className="sidebar__header__info">
        <p className="secondary">Good</p>
        <p className="fullname" onClick={handleClick}>
          Trong Quoc Nguyen
          <KeyboardArrowDownIcon />
        </p>
      </div>
      <Popper
        width="150px"
        className="secondary"
        id={id}
        open={open}
        anchorEl={anchorEl}
        placement="bottom-end"
      >
        <div
          className="popper__element"
          onClick={() => {
            logout();
            history.push("/");
          }}
          style={{ cursor: "pointer " }}
        >
          <ExitToAppIcon />
          LogOut
        </div>
      </Popper>
    </>
  );
  const main = (
    <>
      <div className="sidebar__part__e action">
        <div className="small divbutton circle">+</div>
        <span> Create a class</span>
      </div>
      {dummyClasses.map((c) => (
        <ClassItem key={c.id} name={c.name} id={c.id} />
      ))}
      {/* <ClassItem name="hello"></ClassItem> */}
    </>
  );
  const parts = (
    <SidebarPart
      header={<p className="sidebar__part__header uppercase">CLASS OWNED</p>}
      main={main}
    />
  );
  return (
    <Sidebar
      header={header}
      parts={parts}
      classes={dummyClasses}
      classNames={{
        wrapper: "class__sidebar",
        header: "class__sidebar__header",
      }}
    ></Sidebar>
  );
};

export default ClassSidebar;
