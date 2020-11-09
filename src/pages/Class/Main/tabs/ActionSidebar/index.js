import React, { useReducer, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import ClassService from "../../../../../services/ClassService";
import HeaderNav from "../../../../../shared/Elements/HeaderNav";
import { Context } from "../../../../../shared/Util/context";
import Loading from "../../../../../shared/components/Loading";
import "./ActionSidebar.scss";
const initialData = {
  action: "files",
  files: [],
  people: [],
};
const aSBReducer = (state, action) => {
  switch (action.type) {
    case "SET_DATA": {
      return { ...state, [action.action]: action.payload };
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
  const { globalState } = useContext(Context);
  //1: file, 2: people, 3: setting
  const { action, classId } = useParams();
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
  return (
    <div className="room__info--right">
      <HeaderNav elements={HEADER} />
      {state.action === "files" && (
        <div className="action__data">
          <h4 className="center">IM WORKING ON IT</h4>
        </div>
      )}
      {state.action === "people" ? (
        state.people.length > 0 ? (
          <TableContainer component={Paper}>
            <Table className="group__members__table" aria-label="caption table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="center">Date joined</TableCell>
                  <TableCell align="center">Role</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {state.people.map((member) => (
                  <TableRow key={member.name}>
                    <TableCell align="center">
                      {member.firstName + " " + member.lastName}
                    </TableCell>
                    <TableCell align="center">{member.joinAt}</TableCell>
                    <TableCell align="center">{member.role}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Loading />
        )
      ) : null}
    </div>
  );
};

export default ActionSidebar;
