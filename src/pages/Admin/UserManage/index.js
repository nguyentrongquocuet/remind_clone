import React, { useCallback, useEffect, useReducer, useState } from "react";
import AdminService from "../../../services/AdminService";
import Loading from "../../../shared/components/Loading";
import Table from "../Elements/Table";
import TablePagination from "@material-ui/core/TablePagination";
import ACTIONS from "../Configs/Actions";
import Filter from "../Elements/Filter";
import ModifyUser from "./components/ModifyUser";
import PopupSubject from "../../../shared/Util/PopupSubject";
import UserView from "./components/UserView";
import ROLE from "shared/Util/ROLE";
import "./UserManage.scss";
import SplitView from "../Elements/SplitView";

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "SET_ROWS":
      return { ...state, rowsPerPage: action.payload };
    // case "SET_FILTER":
    //   return { ...state, filter: action.payload };
    case "SET_BATCH_FILTER":
      return { ...state, ...action.payload };
    case "SET_SORT_BY":
      return {
        ...state,
        sortBy: action.payload,
        desc: action.payload === state.sortBy ? (state.desc ? null : 1) : null,
      };
  }
};

const actionReducer = (state, action) => {
  switch (action.type) {
    case "MODIFY_USER":
      return { action: "modify", id: action.payload };
    case "VIEW_USER_INFO":
      return { action: "view", id: action.payload };
    case "KEEP":
      return state;
    case "CLEAR_ACTION":
      return {};
    default:
      return state;
  }
};

const UserManage = () => {
  const [usersData, setUsersData] = useState(null);
  const [actionState, setAction] = useReducer(actionReducer, {});
  const [pageOptions, setPageOptions] = useReducer(reducer, {
    filterField: null,
    filterCon: null,
    page: 0,
    rowsPerPage: 20,
    sortBy: "id",
    desc: 1,
    nameQuery: null,
    rowsPerPageOptions: [5, 10, 20, 50, 100],
  });
  useEffect(() => {
    const getList = async () => {
      const { data } = await AdminService.getUsers(pageOptions);
      console.log(data);
      setUsersData(data);
    };
    getList();
    // return () => {
    //   setUsersData(null);
    // };
  }, [pageOptions]);

  const { sortBy, desc } = pageOptions;
  const onChangePage = useCallback((e, page) => {
    setPageOptions({
      type: "SET_PAGE",
      payload: page,
    });
  }, []);
  console.log(pageOptions);
  const onSortHandle = (e) => {
    // alert(e.currentTarget.getAttribute("user-sort-field"));
    setPageOptions({
      type: "SET_SORT_BY",
      payload: e.currentTarget.getAttribute("user-sort-field"),
    });
  };

  // if (usersData) var { userList, total } = usersData;
  const onRowPerPageChange = useCallback((e) => {
    setPageOptions({
      type: "SET_ROWS",
      payload: e.target.value,
    });
  }, []);

  const onFilter = ({ filterField, nameQuery, filterCon }) => {
    setPageOptions({
      type: "SET_BATCH_FILTER",
      payload: {
        filterField,
        nameQuery,
        filterCon,
      },
    });
  };

  const actionHandle = (e) => {
    console.log(
      e.currentTarget.getAttribute("user-action"),
      e.currentTarget.getAttribute("user-id")
    );
    const actionType = e.currentTarget.getAttribute("user-action");
    const userId = e.currentTarget.getAttribute("user-id");
    if (actionState.action === "modify") {
      onUndoOrSuccess((e) =>
        setAction({
          type: actionType,
          payload: userId,
        })
      );
    } else
      setAction({
        type: actionType,
        payload: userId,
      });
    if (actionType === "BLOCK_USER") {
      PopupSubject.next({
        type: "CONFIRM",
        message: "Do you want to block this user!",
        onConfirm: (e) => revokeUser(userId),
        onCancel: null,
      });
    }
    // switch (actionType) {
    //   case "MODIFY_USER":
    //     setModifyUserId(targetId);
    //     break;
    //   case "VIEW_USER_INFO":
    //     break;
    // }

    // alert(e.target.getAttribute("user-action"));
  };

  const revokeUser = (id) => {
    AdminService.revokeUser(id);
  };

  const onUndoOrSuccess = (e, sCb = () => {}, cCb) => {
    PopupSubject.next({
      type: "CONFIRM",
      message: "Are you sure you want to undo the changes?",
      onConfirm: (e) => {
        setAction({
          type: "CLEAR_ACTION",
        });
        console.log("check-sCb", sCb);
        typeof sCb === "function" && sCb();
      },
      onCancel: cCb,
    });
  };

  const actionPart = (() => {
    switch (actionState.action) {
      case "modify":
        return (
          <ModifyUser
            onUndo={onUndoOrSuccess}
            onSuccess={onUndoOrSuccess}
            id={actionState.id}
            className="side"
          />
        );
      case "view":
        return <UserView className="side" id={actionState.id} />;
      default:
        return null;
    }
  })();
  const { page, rowsPerPage, rowsPerPageOptions } = pageOptions;

  const main = (
    <div className="user-manage-user-list">
      <Filter
        onFilter={onFilter}
        filterField={{
          field: "role",
          conditions: [
            ...Object.entries(ROLE)
              .filter((entry) => !isNaN(entry[0]))
              .map((entry) => {
                return { name: entry[1], condition: entry[0] };
              }),
          ],
        }}
      />
      {usersData ? (
        <div className="list">
          {usersData.total > 0 ? (
            <Table
              actions={ACTIONS.GLOBAL.USER}
              userData
              data={usersData.userList}
              onAction={actionHandle}
              onSort={onSortHandle}
              sortData={{ sortBy, desc }}
            />
          ) : (
            <p className="no-user-notice">No user matched your filter</p>
          )}
          <TablePagination
            component="div"
            count={usersData.total}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={rowsPerPageOptions}
            onChangePage={onChangePage}
            onChangeRowsPerPage={onRowPerPageChange}
          />
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
  // return (
  //   <div className="user-manage">
  //     {main}
  //     {actionPart}
  //   </div>
  // );

  return (
    <SplitView
      wrapperClassName="user-manage"
      leftSide={main}
      rightSide={actionPart}
    />
  );
};

export default UserManage;
