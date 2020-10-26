import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Popper from "../../../../shared/Elements/Popper";
import { Context } from "../../../../shared/Util/context";
import SidebarElement from "./components/SidebarElement";
import "./Sidebar.scss";
import ClassItem from "./components/ClassItem";

const Sidebar = () => {
  const { logout } = useContext(Context);
  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;
  const image = undefined;
  const main = (
    <>
      <div className="sidebar__element__e action">
        <div className="small divbutton circle">+</div>
        <span> Create a class</span>
      </div>
      <ClassItem name="hello"></ClassItem>
    </>
  );
  return (
    <aside className="sidebar">
      <header className="sidebar__header">
        <Link className="sidebar__header__avatar" to="/settings/profile">
          {image ? (
            <img src={image} alt="hell" />
          ) : (
            <div className="alter-avatar">TN</div>
          )}
        </Link>
        <div className="sidebar__header__info">
          <p>Good</p>
          <p className="fullname" onClick={handleClick}>
            Trong Quoc Nguyen
            <KeyboardArrowDownIcon />
          </p>
        </div>

        {/* <button aria-describedby={id} type="button" onClick={handleClick}>
          Toggle Popper
        </button> */}
        <Popper
          width="150px"
          color="#6b6e72"
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
      </header>
      <hr style={{ width: "100%" }} />
      <main>
        <SidebarElement
          header={<h4 className="sidebar__element__header">CLASS OWNED</h4>}
          main={main}
        />
      </main>
    </aside>
  );
};

export default Sidebar;
