import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { Context } from "../../Util/context";

import Button from "../../Elements/Button";
import Hamberger from "../../Elements/Hamburger";
import Modal from "../../Elements/Modal";
import { headerNavigationElements } from "../../Util/headerNavElements";

import "./Header.css";
const Header = (props) => {
  const { setSignUp } = useContext(Context);
  const setMode = () => {
    setSignUp((prev) => !prev);
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
          style={{ backgroundColor: "#3784dd" }}
          open={modalVisibility}
          onClose={() => setModalVisibility(false)}
          className={{ content: "full" }}
          closeButton
        >
          <ul className="header__nav__list flex-align">
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
            style={{
              padding: "0.5rem 1rem",
              color: "#fafafa",
              backgroundColor: "#0274de",
              marginLeft: "1.5rem",
            }}
            className="header__actions__e"
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
