import React, { useReducer, useEffect } from "react";
import { useParams } from "react-router-dom";

import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";

import ClassService from "../../../../../services/ClassService";
import HeaderNav from "../../../../../shared/Elements/HeaderNav";
import Loading from "../../../../../shared/components/Loading";
import "./ActionSidebar.scss";
import Members from "./Members";
import Settings from "./Settings";
import PopupSubject from "../../../../../shared/Util/PopupSubject";
import File from "./File";
import RealTimeService from "../../../../../services/RealTimeService";
import FileSubject from "../../../../../shared/Util/FileSubject";
import MessageService from "../../../../../services/MessageService";
const initialData = {
  action: "files",
  files: null,
  people: [],
};
const aSBReducer = (state, action) => {
  switch (action.type) {
    case "SET_DATA": {
      return { ...state, [action.action]: { ...action.payload } };
    }
    case "SET_ACTION": {
      return { ...state, action: action.payload };
    }
    case "ADD_FILE": {
      return {
        ...state,
        files: { ...state.files, [action.payload.id]: action.payload },
      };
    }
    case "CLEAR_DATA": {
      return {
        ...initialData,
        action: state.action,
      };
    }
    default:
      return state;
  }
};
const ActionSidebar = (props) => {
  //1: file, 2: people, 3: setting
  const { classId } = useParams();
  const [state, dispatch] = useReducer(aSBReducer, initialData);
  useEffect(() => {
    RealTimeService.IOSubject.subscribe((data) => {
      switch (data.type) {
        case "MESSAGES":
          if (data.payload.file) {
            dispatch({
              type: "ADD_FILE",
              payload: data.payload,
            });
          }
          break;
      }
    });
    FileSubject.subscribe((data) => {
      if (data.type === "NEW_FILE") {
        dispatch({
          type: "ADD_FILE",
          payload: data.payload,
        });
      }
    });
    if (state.action === "people") {
      try {
        const getMembers = async () => {
          const data = await ClassService.getClassMembers(
            props.classId || classId
          );
          dispatch({
            type: "SET_DATA",
            action: "people",
            payload: data.data,
          });
        };
        getMembers();
      } catch (error) {
        error.response &&
          PopupSubject.next({
            showTime: 5,
            type: "WARN",
            message: error.response.data,
          });
      }
    } else {
      if (state.action === "files") {
        try {
          const getFiles = async () => {
            const data = await MessageService.getFiles(
              props.classId || classId
            );
            dispatch({
              type: "SET_DATA",
              action: "files",
              payload: data.data,
            });
          };
          getFiles();
        } catch (error) {
          error.response &&
            PopupSubject.next({
              showTime: 5,
              type: "WARN",
              message: error.response.data,
            });
        }

        // dispatch({
        //   type: "SET_DATA",
        //   action: "files",
        //   payload: ["dummy files data"],
        // });
      }
    }
    return () =>
      dispatch({
        type: "CLEAR_DATA",
      });
  }, [state.action, props.classId]);
  const HEADER = [
    {
      text: <ChevronLeftIcon />,
      onClick: props.toggleExpand,
      className: "expandbutton",
    },
    {
      to: "files",
      text: "files",
      onClick: () => {
        dispatch({
          type: "SET_ACTION",
          payload: "files",
        });
      },
      active: state.action === "files",
    },
    {
      to: "people",
      text: "people",
      onClick: () => {
        dispatch({
          type: "SET_ACTION",
          payload: "people",
        });
      },
      active: state.action === "people",
    },
    {
      to: "settings",
      text: "settings",
      onClick: () => {
        dispatch({
          type: "SET_ACTION",
          payload: "settings",
        });
      },
      active: state.action === "settings",
    },
  ];
  console.log("CHD", state);
  return (
    <div className={`room__info--right ${props.expanded ? "expanded" : ""}`}>
      <HeaderNav className="sticky" elements={HEADER} />
      {state.action === "files" &&
        (state.files ? (
          <div className="action__data">
            <File files={state.files} />
          </div>
        ) : (
          <Loading className="actionsidebar__loading" />
        ))}
      {state.action === "people" ? (
        Object.keys(state.people).length > 0 ? (
          // CLASS MEMBERS
          <Members people={state.people} />
        ) : (
          <Loading className="actionsidebar__loading" />
        )
      ) : null}
      {state.action === "settings" && <Settings />}
    </div>
  );
};
export default ActionSidebar;
