import React, { useState, useEffect } from "react";

import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
} from "react-router-dom";
import "./App.scss";
import Class from "./pages/Class";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { Context } from "./shared/Util/context";
const saveToLocalStorage = (obj) => {
  for (const entry of Object.entries(obj)) {
    localStorage.setItem(entry[0], JSON.stringify(entry[1]));
  }
};
const deleteFromLocalStorage = (obj) => {
  for (const entry of Object.entries(obj)) {
    localStorage.removeItem(entry[0]);
  }
};
const getFromLocalStorage = (...key) => {
  if (key.length <= 0) return {};
  let out = {};
  for (const k of key) {
    out[k] = JSON.parse(localStorage.getItem(k));
  }
  return out;
};
function App() {
  console.log("rendering");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInSignUpMode, setIsInSignUpMode] = useState(false);
  const [authData, setAuthData] = useState();

  useEffect(() => {
    const autoAuth = () => {
      const { token, expiresIn, userData } = getFromLocalStorage(
        "token",
        "expiresIn"
      );
      console.log();
      if (!token) console.log("notoken");
      else {
        if (Date.parse(expiresIn) - new Date() < 0) {
          console.log("token has expired");
          return;
        }
      }
    };
    autoAuth();
  }, []);
  const login = (authData) => {
    setIsLoggedIn(true);
    console.log(authData);
    const expiresIn = new Date(Date.now() + authData.expiresIn * 1000);

    const newAuthData = { ...authData, expiresIn: expiresIn };
    setAuthData(newAuthData);
    saveToLocalStorage(newAuthData);
    alert("login successfully");
  };
  const logout = () => {
    setIsLoggedIn(false);
    deleteFromLocalStorage(authData);
  };
  const setSignUp = () => {
    setIsInSignUpMode((prev) => !prev);
  };
  return (
    <Context.Provider
      value={{ authData, isLoggedIn, login, logout, setSignUp, isInSignUpMode }}
    >
      <Router>
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/classes/:id">
            <Class />
          </Route>
          <Redirect to="/" />
        </Switch>
      </Router>
    </Context.Provider>
  );
}

export default App;
