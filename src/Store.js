import React, { useEffect, useReducer, useState } from "react";
import App from "./App";
import Auth from "./auth";
import UserService from "./services/UserService";
import * as local from "./shared/Util/LocalStorage";
const { Context } = require("./shared/Util/context");
const reducer = (context, actions) => {
  let outContext = context;
  console.log(actions);
  if (typeof actions === "object") {
    if (actions.type) {
      outContext = contextReducer(outContext, actions);
    } else {
      console.log(actions);
      for (const action of Object.values(actions)) {
        outContext = contextReducer(outContext, action);
      }
    }
  }
  console.log("lenght", localStorage.length);
  local.saveToLocalStorage(outContext);
  return outContext;
};
const contextReducer = (context, action) => {
  switch (action.type) {
    case "SET_USER_DATA":
      return { ...context, userData: action.payload };
    case "LOGIN_SUCCESS":
      return { ...context, isLoggedIn: true };
    case "LOGIN_FAIL":
      return { ...context, isLoggedIn: false };
    case "SET_CLASS_DATA":
      return { ...context, classData: [...action.payload] };
    case "SET_TOKEN":
      return { ...context, token: action.payload, isLoggedIn: true };
    case "SET_CONVERSATION_DATA":
      return { ...context, conversationData: action.payload };
    case "TOGGLE_SIGNUP":
      return { ...context, toggleSignup: !context.toggleSignup };
    case "ADD_CLASS":
      return { ...context, classData: [...context.classData, action.payload] };
    case "LOGOUT":
      console.log("LOGOUT");
      localStorage.clear();
      console.log(localStorage.getItem("token"));
      return {};
    default:
      return context;
  }
};
const initialState = {
  isLoggedIn: false,
  token: "",
  userData: {
    email: "",
    id: "",
    type: "",
    firstName: "",
    lastName: "",
    parents: [],
  },
  //classId:, className,
  classData: [],
  //[[prefix-id, prefix-id]]
  conversationData: [],
  toggleSignup: false,
};
const Store = () => {
  const [globalState, dispatch] = useReducer(reducer, initialState);
  const [auth, setAuth] = useState(false);
  console.log("rendering");
  useEffect(() => {
    console.log(globalState.toggleSignup);
    if (!globalState.toggleSignup)
      UserService.auth().then((data) => {
        console.log("data", data);
        if (!data) {
          console.log("LOGD");
          dispatch({
            type: "LOGOUT",
          });
        } else {
          dispatch({
            1: {
              type: "SET_TOKEN",
              payload: data.token,
            },
            2: {
              type: "SET_USER_DATA",
              payload: data.userData,
            },
            3: {
              type: "LOGIN_SUCCESS",
            },
          });
        }
      });
  }, []);

  return (
    <Context.Provider value={{ globalState: globalState, dispatch: dispatch }}>
      {!auth ? <Auth setAuth={setAuth} /> : <App />}
    </Context.Provider>
  );
};

export default Store;
