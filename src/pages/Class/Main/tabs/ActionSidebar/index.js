import React, { useReducer, useEffect } from "react";
import { useParams } from "react-router-dom";

import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";

import ClassService from "../../../../../services/ClassService";
import HeaderNav from "../../../../../shared/Elements/HeaderNav";
import Loading from "../../../../../shared/components/Loading";
import "./ActionSidebar.scss";
import Members from "./Members";
const initialData = {
  action: "files",
  files: [],
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
    case "CLEAR_DATA": {
      return state;
    }
  }
};
const ActionSidebar = (props) => {
  console.log("ACTIONSIDEBAR");
  //1: file, 2: people, 3: setting
  const { classId } = useParams();
  const [state, dispatch] = useReducer(aSBReducer, initialData);
  console.log("DATA", state.files, state.people);

  useEffect(() => {
    if (state.action === "people") {
      try {
        ClassService.getClassMembers(props.classId || classId).then((data) => {
          console.log("member", data.data);
          dispatch({
            type: "SET_DATA",
            action: "people",
            payload: data.data,
          });
        });
      } catch (error) {
        alert(error);
      }
    } else {
      if (state.action === "files") {
        dispatch({
          type: "SET_DATA",
          action: "files",
          payload: ["dummy files data"],
        });
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
  console.log(state);
  return (
    <div className={`room__info--right ${props.expanded ? "expanded" : ""}`}>
      <HeaderNav elements={HEADER} />
      {state.action === "files" && (
        <div className="action__data">
          <h4 className="center">IM WORKING ON IT</h4>
        </div>
      )}
      {state.action === "people" ? (
        Object.keys(state.people).length > 0 ? (
          // CLASS MEMBERS
          <Members people={state.people} />
        ) : (
          <Loading className="actionsidebar__loading" />
        )
      ) : null}
    </div>
  );
};
export default ActionSidebar;
