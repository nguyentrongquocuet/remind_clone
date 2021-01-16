import { TablePagination } from "@material-ui/core";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import AdminService from "services/AdminService";
import Loading from "shared/components/Loading";
import PopupSubject from "shared/Util/PopupSubject";
import ACTION from "../Configs/Actions";
import Filter from "../Elements/Filter";
import SplitView from "../Elements/SplitView";
import Table from "../Elements/Table";
import "./ClassManage.scss";
import ModifyClass from "./components/ModifyClass";
import ViewClass from "./components/ViewClass";

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
    case "MODIFY_CLASS":
      return { action: "modify", id: action.payload };
    case "VIEW_CLASS_INFO":
      return { action: "view", id: action.payload };
    case "KEEP":
      return state;
    case "CLEAR_ACTION":
      return {};
    default:
      return state;
  }
};

const ClassManage = () => {
  const [classData, setClassData] = useState(null);
  const [actionState, setAction] = useReducer(actionReducer, {});
  const [pageOptions, setPageOptions] = useReducer(reducer, {
    page: 0,
    rowsPerPage: 20,
    sortBy: "name",
    desc: 1,
    nameQuery: null,
    rowsPerPageOptions: [5, 10, 20, 50, 100],
  });

  useEffect(() => {
    const getList = async () => {
      const { data } = await AdminService.getClasses(pageOptions);
      console.log(data);
      setClassData(data);
    };
    getList();
    // return () => {
    //   setUsersData(null);
    // };
  }, [pageOptions]);

  const onSortHandle = (e) => {
    // alert(e.currentTarget.getAttribute("user-sort-field"));
    setPageOptions({
      type: "SET_SORT_BY",
      payload: e.currentTarget.getAttribute("user-sort-field"),
    });
  };

  const onChangePage = useCallback((e, page) => {
    setPageOptions({
      type: "SET_PAGE",
      payload: page,
    });
  }, []);

  const onFilter = ({ nameQuery }) => {
    setPageOptions({
      type: "SET_BATCH_FILTER",
      payload: {
        nameQuery,
      },
    });
  };
  const onRowPerPageChange = useCallback((e) => {
    setPageOptions({
      type: "SET_ROWS",
      payload: e.target.value,
    });
  }, []);
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
  const actionHandle = (e) => {
    const actionType = e.currentTarget.getAttribute("class-action");
    const classId = e.currentTarget.getAttribute("class-id");
    if (actionState.action === "modify") {
      onUndoOrSuccess((e) =>
        setAction({
          type: actionType,
          payload: classId,
        })
      );
    } else
      setAction({
        type: actionType,
        payload: classId,
      });
    if (actionType === "DELETE_CLASS") {
      PopupSubject.next({
        type: "CONFIRM",
        message: "Do you want to remove this class!",
        onConfirm: (e) => removeClass(classId),
        onCancel: null,
      });
    }

    const removeClass = (classId) => {
      AdminService.removeClass(classId);
    };
  };
  const { sortBy, desc } = pageOptions;

  const { page, rowsPerPage, rowsPerPageOptions } = pageOptions;

  const main = (
    <div className="class-manage-class-list">
      <Filter onFilter={onFilter} />
      {classData ? (
        <div className="list">
          {classData.total > 0 ? (
            <Table
              actions={ACTION.GLOBAL.CLASS}
              classData
              data={classData.classList}
              onAction={actionHandle}
              onSort={onSortHandle}
              sortData={{ sortBy, desc }}
            />
          ) : (
            <p className="no-user-notice">No user matched your filter</p>
          )}
          <TablePagination
            component="div"
            count={classData.total}
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

  const actionPart = (() => {
    switch (actionState.action) {
      case "modify":
        return (
          <ModifyClass
            onUndo={onUndoOrSuccess}
            onSuccess={onUndoOrSuccess}
            classId={actionState.id}
            className="side"
          />
        );
      case "view":
        return <ViewClass className="side" classId={actionState.id} />;
      default:
        return null;
    }
  })();
  const side = <div className="side">hEllo</div>;
  return (
    <SplitView
      wrapperClassName="class-manage"
      leftSide={main}
      rightSide={actionPart}
    />
  );
};

export default ClassManage;
