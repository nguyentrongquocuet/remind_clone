import React, { useState, useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
} from "react-router-dom";
// import Class from "./pages/Class";
import { Context } from "./shared/Util/context";
import "./App.scss";
import { Suspense } from "react";
import Authpreloader from "./shared/components/authpreloader/Authpreloader";
const Login = React.lazy(() => import("./pages/Login"));
const Home = React.lazy(() => import("./pages/Home"));
const Class = React.lazy(async () => {
  return import("./pages/Class");
});

function App() {
  const { globalState } = useContext(Context);
  let routes;
  const isAuthenticated = globalState.isLoggedIn;
  if (isAuthenticated) {
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
  } else
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
  return <Router>{routes}</Router>;
}

export default App;
