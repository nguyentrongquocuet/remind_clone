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
import { Suspense } from "react";
import Authpreloader from "./shared/components/authpreloader/Authpreloader";
import "./App.scss";
import GoogleAuthPage from "./shared/components/GoogleAuthPage";
import RedirectPage from "./shared/components/RedirectPage/RedirectPage";
import JoinClassPage from "./shared/components/JoinClassPage/JoinClassPage";
import ConnectChildPage from "./shared/components/ConnectChildPage/ConnectChildPage";
const Admin = React.lazy(() => import("./pages/Admin"));
const Login = React.lazy(() => import("./pages/Login"));
const Home = React.lazy(() => import("./pages/Home"));
const Class = React.lazy(async () => {
  return import("./pages/Class");
});
const ChooseRole = React.lazy(() => import("./shared/components/ChooseRole"));
function App() {
  const { globalState, dispatch } = useContext(Context);
  const { isLoggedIn, userData } = globalState;
  let routes;
  console.log("yrk", globalState.redirectUrl);

  if (isLoggedIn) {
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
    else if (userData.role === 3) {
      routes = (
        <Suspense fallback={<Authpreloader />}>
          <Switch>
            <Route path="/admin/:mode/:action">
              <Admin />
            </Route>
            <Route path="/admin/:mode">
              <Admin />
            </Route>
            <Redirect to="/admin/overall"></Redirect>
          </Switch>
        </Suspense>
      );
    } else {
      routes = (
        <Suspense fallback={<Authpreloader />}>
          <Switch>
            {globalState.redirectUrl && (
              <Route path="**">
                <RedirectPage redirect={globalState.redirectUrl} />
              </Route>
            )}
            <Route exact path="/connect">
              <ConnectChildPage />
            </Route>
            <Route exact path="/join">
              <JoinClassPage />
            </Route>
            <Route exact path="/classes/:classId/private/:userId">
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
    }
  } else {
    routes = (
      <Suspense fallback={<Authpreloader />}>
        <Switch>
          <Route exact path="/with-github">
            <div>Wait a few second</div>
          </Route>
          <Route exact path="/with-google">
            <GoogleAuthPage />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/" exact>
            <Home />
          </Route>
          <Route exact path="*">
            <RedirectPage />
          </Route>
          <Redirect to="*" />
        </Switch>
      </Suspense>
    );
  }
  return <Router>{routes}</Router>;
}

export default App;
