import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Sidebar from "../../../shared/components/Sidebar";
import Popper from "../../../shared/Elements/Popper";
import { Context } from "../../../shared/Util/context";
import Avatar from "@material-ui/core/Avatar";
const MessagePanel = React.lazy(() =>
  import("../../../shared/components/MessagePanel")
);

const ClassSidebar = ({ loading }) => {
  const { dispatch, globalState } = useContext(Context);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;
  const image = undefined;
  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const header = (
    <>
      <Link className="sidebar__header__avatar" to="/settings/profile">
        <Avatar className="alter-avatar medium" alt="hello" src="dsdj">
          {globalState.userData.firstName[0] + globalState.userData.lastName[0]}
        </Avatar>
      </Link>
      <div className="sidebar__header__info">
        <p className="secondary">
          Good {new Date().getHours() >= 17 ? "Afternoon" : "Morning"}
        </p>
        <p className="fullname" onClick={handleClick}>
          {globalState.userData.firstName + " " + globalState.userData.lastName}
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
            dispatch({ type: "LOGOUT" });
            // history.push("/");
          }}
          style={{ cursor: "pointer " }}
        >
          <ExitToAppIcon />
          LogOut
        </div>
      </Popper>
    </>
  );
  const parts = <MessagePanel loading={loading} />;
  return (
    <Sidebar
      header={header}
      parts={parts}
      classNames={{
        wrapper: "class__sidebar",
        header: "class__sidebar__header",
      }}
    />
  );
};

export default ClassSidebar;
