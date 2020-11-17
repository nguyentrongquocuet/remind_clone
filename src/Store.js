import React, { useEffect, useReducer, useState } from "react";
import App from "./App";
import Auth from "./auth";
import io from "socket.io-client";
import { Subject } from "rxjs";
import UserService from "./services/UserService";
import * as local from "./shared/Util/LocalStorage";
import RealTimeService from "./services/RealTimeService";
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
  console.log("lenght", localStorage.length);
  local.saveToLocalStorage({ ...outContext, IO: undefined, subject: null });
  return outContext;
};
const subject = new Subject();
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
    case "SET_UP_DONE":
      return { ...context, settingUpIsDone: true };
    case "SET_CLASS_DATA":
      return { ...context, classData: { ...action.payload } };
    case "SET_TOKEN":
      return { ...context, token: action.payload, isLoggedIn: true };
    case "SET_CONVERSATION_DATA":
      return { ...context, conversationData: action.payload };
    case "TOGGLE_SIGNUP":
      context.subject.next("signup hhe");
      return { ...context, toggleSignup: !context.toggleSignup };
    case "ADD_CLASS":
      return {
        ...context,
        classData: {
          ...context.classData,
          [action.payload.classId]: action.payload,
        },
      };
    case "LOGOUT":
      console.log("LOGOUT");
      localStorage.clear();
      console.log(localStorage.getItem("token"));
      return { subject: new Subject() };
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
  subjects: { messages: new Subject() },
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
  useEffect(() => {
    if (globalState.isLoggedIn && !globalState.settingUpIsDone) {
      console.log("SETTING IO");
      RealTimeService.init({ globalState, dispatch });
      // const ioC = io.connect("http://localhost:5000");
      // ioC.on("auth", () => {
      //   dispatch({
      //     1: {
      //       type: "SET_TOKEN",
      //       payload: globalState.token,
      //     },
      //     2: {
      //       type: "SET_USER_DATA",
      //       payload: globalState.userData,
      //     },
      //     3: {
      //       type: "LOGIN_SUCCESS",
      //     },
      //     4: { type: "SET_IO", payload: ioC },
      //     5: { type: "SET_UP_DONE" },
      //   });
      // });
      // ioC.on("messages", (data) => {
      //   alert(data.content);
      // });
      // ioC.emit("auth", globalState.userData.id);
    }
  }, [globalState.isLoggedIn]);
  return (
    <Context.Provider value={{ globalState: globalState, dispatch: dispatch }}>
      {!auth ? <Auth setAuth={setAuth} /> : <App />}
    </Context.Provider>
  );
};

export default Store;
