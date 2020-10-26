import React, { useState } from "react";

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
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInSignUpMode, setIsInSignUpMode] = useState(false);
  const [authData, setAuthData] = useState();
  const login = (authData) => {
    setIsLoggedIn(true);
    console.log(authData);
    setAuthData(authData);
    saveToLocalStorage(authData);
    alert("login successfully");
  };
  const logout = () => {
    setIsLoggedIn(false);
  };
  const setSignUp = () => {
    setIsInSignUpMode((prev) => !prev);
  };
  return (
    <Context.Provider
      value={{ isLoggedIn, login, logout, setSignUp, isInSignUpMode }}
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
