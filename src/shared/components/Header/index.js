import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { Context } from "../../Util/context";

import Button from "../../Elements/Button";
import Hamberger from "../../Elements/Hamburger";
import Modal from "../../Elements/Modal";
import { headerNavigationElements } from "../../Util/headerNavElements";

import "./Header.scss";
const Header = (props) => {
  const { dispatch } = useContext(Context);
  const setMode = () => {
    dispatch({ type: "TOGGLE_SIGNUP" });
  };
  const [modalVisibility, setModalVisibility] = useState(false);
  if (props.noChild) {
    return (
      <div className="header">
        <div className="header__logo flex-align">
          <NavLink to="/">
            <p>REMIND</p>
          </NavLink>
        </div>
        {props.children}
      </div>
    );
  }
  return (
    <React.Fragment>
      {modalVisibility && (
        <Modal
          open={modalVisibility}
          onClose={() => setModalVisibility(false)}
          classNames={{ content: "full" }}
          closeButton
        >
          <ul
            className="header__nav__list flex-align"
            style={{ pointerEvents: "all" }}
          >
            {headerNavigationElements.map((e) => {
              if (e.text === "Signup") return null;
              return (
                <li key={e.text} className="header__nav__e">
                  <NavLink to={e.to}>{e.text}</NavLink>
                </li>
              );
            })}
          </ul>
        </Modal>
      )}
      <div className="header">
        <div className="header__logo flex-align">
          <NavLink to="/">
            <p>REMIND</p>
          </NavLink>
        </div>
        <div className="header__nav flex-align">
          <ul className="header__nav__list flex-align">
            {headerNavigationElements.map((e) => {
              if (e.text !== "Login" && e.text !== "Signup")
                return (
                  <li key={e.text} className="header__nav__e">
                    <NavLink to={e.to}>{e.text}</NavLink>
                  </li>
                );
              else return null;
            })}
          </ul>
        </div>
        {/* <span className="space"></span> */}
        <div className="header__actions flex-align">
          <NavLink className="header__actions__e" to="/login">
            Login
          </NavLink>
          <Button
            color="primary"
            className="header__actions__e header__signup"
            onClick={setMode}
            default
          >
            Signup
          </Button>
          {!modalVisibility && (
            <Hamberger
              onClick={() => setModalVisibility(true)}
              className="header__actions__e hamburger"
            />
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Header;
