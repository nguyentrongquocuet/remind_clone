import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
} from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { Context } from "./shared/Util/context";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInSignUpMode, setIsInSignUpMode] = useState(false);
  const login = () => {
    setIsLoggedIn(true);
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
          <Redirect to="/" />
        </Switch>
      </Router>
    </Context.Provider>
  );
}

export default App;
