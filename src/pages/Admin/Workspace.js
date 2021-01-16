import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import ClassManage from "./ClassManage";
import CreateClass from "./ClassManage/components/CreateClass";
import AdminOverall from "./Overall";
import UserManage from "./UserManage";
import NewUser from "./UserManage/components/NewUser";

const Workspace = (props) => {
  const { action, mode } = useParams();
  const [curMode, setCurMode] = useState(mode);
  console.log(action, mode);
  const workspace = useMemo(() => {
    switch (curMode) {
      case "overall":
        return <AdminOverall />;
      case "users":
        return <UserManage />;
      case "new":
        switch (action) {
          case "user":
            return <NewUser />;
          case "class":
            return <CreateClass />;
        }
        break;
      case "classes":
        return <ClassManage />;
    }
  }, [curMode, action]);
  useEffect(() => {
    curMode !== mode && setCurMode(mode);
    document.title = `Remind Admin - ${mode}`;
  }, [mode]);
  return <div className="admin-page-main__workspace">{workspace}</div>;
};

export default Workspace;
