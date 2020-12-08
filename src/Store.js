import React, { useEffect, useReducer, useState } from "react";
import App from "./App";
import Auth from "./auth";
import * as local from "./shared/Util/LocalStorage";
import RealTimeService from "./services/RealTimeService";
import PopUp from "./shared/Elements/PopUp";
import popupSubject from "./shared/Util/PopupSubject";
import io from "socket.io-client";
const { Context } = require("./shared/Util/context");

const reducer = (context, actions) => {
  let outContext = context;
  if (typeof actions === "object") {
    if (actions.type) {
      outContext = contextReducer(outContext, actions);
    } else {
      for (const action of Object.values(actions)) {
        outContext = contextReducer(outContext, action);
      }
    }
  }
  local.saveToLocalStorage({ ...outContext, IO: undefined, subject: null });
  return outContext;
};
const contextReducer = (context, action) => {
  switch (action.type) {
    case "SET_IO":
      return { ...context, IO: action.payload };
    case "SET_USER_DATA":
      return { ...context, userData: action.payload };
    case "SET_ROLE":
      return {
        ...context,
        userData: { ...context.userData, role: action.payload },
      };

    case "LOGIN_SUCCESS":
      return {
        ...context,
        isLoggedIn: true,
      };
    case "LOGIN_FAIL":
      return { ...context, isLoggedIn: false };
    case "SET_CLASS_MEMBER":
      return {
        ...context,
        classData: {
          ...context.classData,
          [action.classId]: {
            ...context.classData[action.classId],
            members: { ...action.payload },
          },
        },
      };
    case "SET_UNREAD":
      return {
        ...context,
        classData: {
          ...context.classData,
          [action.id]: {
            ...context.classData[action.id],
            unread: true,
          },
        },
      };
    case "SET_READ":
      return {
        ...context,
        classData: {
          ...context.classData,
          [action.id]: {
            ...context.classData[action.id],
            unread: false,
          },
        },
      };
    case "SET_UP_DONE":
      return { ...context, settingUpIsDone: true };
    case "SET_CLASS_DATA":
      return { ...context, classData: { ...action.payload } };
    case "SET_TOKEN":
      return { ...context, token: action.payload, isLoggedIn: true };
    case "SET_CONVERSATION_DATA":
      return { ...context, conversationData: action.payload };
    case "TOGGLE_SIGNUP":
      return { ...context, toggleSignup: !context.toggleSignup };
    case "ADD_CLASS":
      return {
        ...context,
        classData: {
          ...context.classData,
          [action.payload.classId]: action.payload,
        },
      };
    case "SET_REDIRECT_URL":
      return { ...context, redirectUrl: action.payload.url };
    case "CLEAR_REDIRECT_URL":
      return { ...context, redirectUrl: null };
    case "LOGOUT":
      localStorage.clear();
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
    name: "",
  },
  //classId:, className,
  classData: {},
  //[[prefix-id, prefix-id]]
  conversationData: [],
  toggleSignup: false,
  settingUpIsDone: false,
};
const Store = () => {
  const [globalState, dispatch] = useReducer(reducer, initialState);
  const [auth, setAuth] = useState(false);
  const [popup, setPopup] = useState(null);
  const [IO, setIO] = useState(null);
  useEffect(() => {
    const IO = io.connect("http://localhost:5000");
    setIO(IO);
  }, []);
  useEffect(() => {
    const sub = popupSubject.asObservable().subscribe((popupContent) => {
      setPopup(popupContent);
      if (popupContent.type === "ERROR") {
        dispatch({ type: "LOGOUT" });
      }
    });
  }, []);
  useEffect(() => {
    if (globalState.isLoggedIn && !globalState.settingUpIsDone) {
      RealTimeService.init(IO, { globalState, dispatch });
    }
  }, [globalState.isLoggedIn]);
  return (
    <Context.Provider value={{ globalState: globalState, dispatch: dispatch }}>
      {popup && <PopUp onClose={() => setPopup(null)} content={popup} />}
      {!auth ? <Auth setAuth={setAuth} /> : <App />}
    </Context.Provider>
  );
};

export default Store;
