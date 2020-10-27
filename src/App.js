import React, { useState, useEffect, useContext } from "react";

import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
} from "react-router-dom";
import Class from "./pages/Class";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { Context } from "./shared/Util/context";
import * as local from "./shared/Util/LocalStorage";
import UserService from "./services/UserService";

import "./App.scss";
function App() {
  console.log("rendering");
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isInSignUpMode, setIsInSignUpMode] = useState(false);
  const [authData, setAuthData] = useState();
  useEffect(() => {
    UserService.auth().then((data) => {
      console.log("data", data);
      if (!data) {
        setIsAuthenticated(false);
      } else {
        setAuthData((prev) => {
          return { ...prev, ...data };
        });
        setIsAuthenticated(true);
      }
    });
  }, []);

  const login = (authData) => {
    setIsAuthenticated(true);
    console.log(authData);
    const expiresIn = new Date(Date.now() + authData.expiresIn * 1000);
    const newAuthData = { ...authData, expiresIn: expiresIn };
    setAuthData(newAuthData);
    console.log(authData);
    local.saveToLocalStorage(newAuthData);
    alert("login successfully");
    // return <Redirect to="/login" />;
  };

  const logout = () => {
    console.log(authData);
    setIsAuthenticated(false);
    local.deleteFromLocalStorage(authData);
  };

  const setSignUp = () => {
    setIsInSignUpMode((prev) => !prev);
  };

  let routes;
  console.log("isAuthenticated", isAuthenticated);

  if (isAuthenticated) {
    routes = (
      <Switch>
        <Route exact path="/classes">
          <Class />
        </Route>
        <Route exact path="/classes/:id/:action">
          <Class />
        </Route>
        <Route exact path="/classes/:id">
          <Class />
        </Route>
        <Redirect to="/classes" />
      </Switch>
    );
  } else
    routes = (
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/" exact>
          <Home />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  return (
    <Context.Provider
      value={{
        authData,
        isAuthenticated,
        login,
        logout,
        setSignUp,
        isInSignUpMode,
      }}
    >
      <Router>{routes}</Router>
    </Context.Provider>
  );
}

export default App;
