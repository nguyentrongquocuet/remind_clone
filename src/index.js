import React from "react";
import ReactDOM from "react-dom";
import Store from "./Store";
import * as serviceWorker from "./serviceWorker";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import "./index.css";
// window.console.log = () => {};
// window.console.warn = () => {};
// window.console.error = () => {};
ReactDOM.render(<Store />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
