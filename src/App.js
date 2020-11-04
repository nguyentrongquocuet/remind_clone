import React, { useState, useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
} from "react-router-dom";
// import Class from "./pages/Class";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { Context } from "./shared/Util/context";
import "./App.scss";
import { Suspense } from "react";
const Class = React.lazy(async () => {
  return import("./pages/Class");
});

function App() {
  const { globalState } = useContext(Context);
  let routes;
  const isAuthenticated = globalState.isLoggedIn;
  if (isAuthenticated) {
    routes = (
      <Suspense fallback={<div>LOADING...</div>}>
        <Switch>
          <Route exact path="/classes/:classId/:action">
            <Class />
          </Route>
          <Route exact path="/classes/:classId/messages/:roomId">
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
  return <Router>{routes}</Router>;
}

export default App;
