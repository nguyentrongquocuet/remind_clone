import React, { useCallback, useState, useEffect, useReducer } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Popper from "@material-ui/core/Popper";
import TextField from "../../../../../shared/Elements/TextField";
import ClassService from "../../../../../services/ClassService";
import PopupSubject from "../../../../../shared/Util/PopupSubject";
import ModalSubject from "../../../../../shared/Util/ModalSubject";
import Loading from "../../../../../shared/components/Loading";
import ROLE from "../../../../../shared/Util/ROLE";
import moment from "moment";
import "./Members.scss";
import PeopleInfo from "../../../Modal/PeopleInfo";
import useFind from "../../../../../shared/Util/useFind";
const sort = (field = "id", desc = -1) => {
  if (desc === 0) desc = 1;
  return (a, b) => {
    if (a[field] > b[field]) return -desc * 1;
    if (a[field] < b[field]) return -desc * -1;
    return 0;
  };
};

const toggleInvite = () => {
  ModalSubject.next({
    type: "INVITE_PEOPLE",
  });
};

const filter = (role) => {
  if (!role) return (a) => true;
  return (a) => {
    return a.role === role;
  };
};
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_DATA":
      return { ...state, people: { ...action.payload } };
    case "SET_ROLE":
      return { ...state, filterRole: action.payload };
    case "CLEAR_DATA":
      return {
        people: null,
        filterRole: null,
      };
  }
};
const makeFilterField = (e) => e.firstName + " " + e.lastName;
const Members = (props) => {
  const { classId } = props;
  //for get info
  const [userId, setUserId] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { expanded } = props;
  const togglePeopleView = (event, id) => {
    setUserId(id);
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const [setQuery, searchFilter] = useFind("", "i");

  const open = Boolean(anchorEl);
  const [sortOptions, setSortOptions] = useState({ field: "name", desc: -1 });
  const setSortField = useCallback((field) => {
    if (field == sortOptions.field) {
      setSortOptions((prev) => {
        return { ...prev, desc: 0 - prev.desc };
      });
    } else {
      setSortOptions({ field: field, desc: -1 });
    }
  });
  const [state, dispatch] = useReducer(reducer, {
    people: null,
    filterRole: null,
  });
  useEffect(() => {
    try {
      const getMembers = async () => {
        const data = await ClassService.getClassMembers(classId);
        console.log(data);
        dispatch({
          type: "SET_DATA",
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
    return () => {
      dispatch({
        type: "CLEAR_DATA",
        payload: null,
      });
    };
  }, [classId]);
  useEffect(() => {
    if (!expanded) setAnchorEl(null);
  }, [expanded]);
  return (
    <>
      <Popper placement="right-end" open={open} anchorEl={anchorEl}>
        <PeopleInfo
          onClose={(e) => {
            setAnchorEl(null);
          }}
          id={userId}
        />
      </Popper>
      {state.people ? (
        <div>
          <div className="actions">
            <TextField onChange={setQuery} placeholder="Search people" />
            <div
              className="filter"
              onClick={(e) => {
                document.getElementById("check-filter").click();
              }}
            >
              <p>
                {state.filterRole
                  ? ROLE[state.filterRole] + "s"
                  : "Select Role"}
              </p>
              <input
                type="checkbox"
                style={{ display: "none" }}
                id="check-filter"
              />
              <div className="filter-roles">
                <span
                  onClick={(e) => {
                    dispatch({
                      type: "SET_ROLE",
                      payload: null,
                    });
                  }}
                >
                  Everyone ({Object.values(state.people).length})
                </span>
                <span
                  onClick={(e) => {
                    dispatch({
                      type: "SET_ROLE",
                      payload: 1,
                    });
                  }}
                >
                  Students (
                  {
                    Object.values(state.people).filter(
                      (p) => ROLE[p.role] === "Student"
                    ).length
                  }
                  )
                </span>
                <span
                  onClick={(e) => {
                    dispatch({
                      type: "SET_ROLE",
                      payload: 2,
                    });
                  }}
                >
                  Parents (
                  {
                    Object.values(state.people).filter(
                      (p) => ROLE[p.role] === "Parent"
                    ).length
                  }
                  )
                </span>
              </div>
            </div>
            <div className="pending-requests">
              <p>
                Pending requests <span>1</span>
              </p>
            </div>
          </div>
          {Object.values(state.people).filter(filter(state.filterRole)).length >
          0 ? (
            <>
              <Table className="group__members__table sticky">
                <TableHead>
                  <TableRow>
                    <TableCell onClick={() => setSortField("name")}>
                      Name{" "}
                      {sortOptions.field == "name" && (
                        <ChevronLeftIcon
                          className={`chevron ${
                            sortOptions.desc > 0 ? "up" : "down"
                          }`}
                        />
                      )}
                    </TableCell>
                    <TableCell
                      onClick={() => setSortField("joinAt")}
                      align="center"
                    >
                      Date joined{" "}
                      {sortOptions.field == "joinAt" && (
                        <ChevronLeftIcon
                          className={`chevron ${
                            sortOptions.desc > 0 ? "up" : "down"
                          }`}
                        />
                      )}
                    </TableCell>
                    <TableCell
                      onClick={() => setSortField("role")}
                      align="center"
                    >
                      Role
                      {sortOptions.field == "role" && (
                        <ChevronLeftIcon
                          className={`chevron ${
                            sortOptions.desc > 0 ? "up" : "down"
                          }`}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                </TableHead>
              </Table>
              <TableContainer component={Paper}>
                <Table
                  className="group__members__table"
                  aria-label="caption table"
                >
                  <TableBody>
                    {Object.values(state.people)
                      .filter(filter(state.filterRole))
                      .filter((e) => searchFilter.test(makeFilterField(e)))
                      .sort(sort(sortOptions.field, sortOptions.desc))
                      .map((member) => (
                        <TableRow key={member.id}>
                          <TableCell
                            align="left"
                            onClick={(e) =>
                              expanded ? togglePeopleView(e, member.id) : null
                            }
                          >
                            {member.name}
                          </TableCell>
                          <TableCell align="left">
                            {moment(member.joinAt).format("DD-MM-YYYY")}
                          </TableCell>
                          <TableCell align="left">
                            {ROLE[member.role]}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ) : (
            <p className="no-one-invite-slogan">
              There’s no one here!{" "}
              <span onClick={toggleInvite}>Invite people to join</span>{" "}
            </p>
          )}
        </div>
      ) : (
        <Loading className="actionsidebar__loading" />
      )}
    </>
  );
};

export default Members;
