import React, { useContext, useEffect, useMemo, useState } from "react";
import Header from "../../shared/components/Header";
import AdminSidebar from "./Sidebar";
import AdminOverall from "./Overall";
import "./Admin.scss";
import { useHistory, useParams } from "react-router-dom";
import Button from "../../shared/Elements/Button";
import { Context } from "../../shared/Util/context";
import UserManage from "./UserManage";
const Admin = () => {
  const history = useHistory();
  const { action, mode } = useParams();
  const [curMode, setCurMode] = useState(mode);
  const { dispatch } = useContext(Context);

  const workspace = useMemo(() => {
    switch (curMode) {
      case "overall":
        return <AdminOverall />;
      case "users":
        return <UserManage />;
    }
  }, [curMode]);
  useEffect(() => {
    curMode !== mode && setCurMode(mode);
  }, [mode]);
  console.log("curMode", curMode);
  return (
    <div className="admin-page">
      <Header noChild>
        <Button
          className="admin-page-logout"
          onClick={(e) =>
            dispatch({
              type: "LOGOUT",
            })
          }
        >
          Logout
        </Button>
      </Header>
      <div className="admin-page-main">
        <AdminSidebar />
        <div className="admin-page-main__workspace">{workspace}</div>
      </div>
    </div>
  );
};

export default Admin;
