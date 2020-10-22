import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Button from "../../Elements/Button";
import Hamberger from "../../Elements/Hamburger";
import Modal from "../../Elements/Modal";
import { headerNavigationElements } from "../../Util/headerNavElements";
import "./Header.css";
const Header = () => {
  const [modalVisibility, setModalVisibility] = useState(false);
  return (
    <React.Fragment>
      {modalVisibility && (
        <Modal
          style={{ backgroundColor: "#3784dd" }}
          onClose={() => setModalVisibility(false)}
          className="full"
        >
          <ul className="header__nav__list flex-align">
            {headerNavigationElements.map((e) => {
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
        <span className="space"></span>
        <div className="header__actions flex-align">
          <NavLink className="header__actions__e" to="/login">
            Login
          </NavLink>
          <Button
            style={{ padding: "0.7rem 1rem" }}
            className="header__actions__e"
          >
            Signup
          </Button>
          {!modalVisibility && (
            <Hamberger
              onClick={() => setModalVisibility(true)}
              className="header__actions__e"
            />
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Header;
