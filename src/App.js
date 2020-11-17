import React, { useState, useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
} from "react-router-dom";
// import Class from "./pages/Class";
import io from "socket.io-client";

import { Context } from "./shared/Util/context";
import "./App.scss";
import { Suspense } from "react";
import Authpreloader from "./shared/components/authpreloader/Authpreloader";
const Login = React.lazy(() => import("./pages/Login"));
const Home = React.lazy(() => import("./pages/Home"));
const Class = React.lazy(async () => {
  return import("./pages/Class");
});
const ChooseRole = React.lazy(() => import("./shared/components/ChooseRole"));
function App() {
  const { globalState, dispatch } = useContext(Context);
  let routes;
  const { isLoggedIn, userData } = globalState;
  useEffect(() => {
    if (isLoggedIn) {
      const ioC = io.connect("http://localhost:5000");
      dispatch({ TYPE: "SET_IO", payload: ioC });
      ioC.on("hello", (str) => {
        alert(str);
      });
    }
  }, isLoggedIn);
  if (isLoggedIn) {
    // const width =
    //   window.innerWidth > 0 ? window.innerWidth : window.screen.width;

    if (userData.role === null)
      routes = (
        <Suspense fallback={<Authpreloader />}>
          <Switch>
            <Route path="/set_role" exact>
              <ChooseRole />
            </Route>
            <Redirect to="/set_role"></Redirect>
          </Switch>
        </Suspense>
      );
    else
      routes = (
        <Suspense fallback={<Authpreloader />}>
          <Switch>
            <Route exact path="/classes/:classId/:action">
              <Class />
            </Route>
            <Route exact path="/classes/:classId">
              <Class />
            </Route>
            <Route path="/classes/">
              <Class />
            </Route>
            <Route exact path="/started">
              <Class />
            </Route>
            <Redirect to="/classes" />
          </Switch>
        </Suspense>
      );
  } else {
    routes = (
      <Suspense fallback={<Authpreloader />}>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/" exact>
            <Home />
          </Route>
          <Redirect to="/" />
        </Switch>
      </Suspense>
    );
  }
  return <Router>{routes}</Router>;
}

export default App;
