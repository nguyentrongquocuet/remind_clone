import React, { useContext, useState } from "react";
import Header from "../../shared/components/Header";
import AdminSidebar from "./Sidebar";
import AdminOverall from "./Overall";
import "./Admin.scss";
import { useHistory, useParams } from "react-router-dom";
import Button from "../../shared/Elements/Button";
import { Context } from "../../shared/Util/context";
const Admin = () => {
  const [curMode, setCurMode] = useState("overall");
  const history = useHistory();
  const { action, mode } = useParams();
  const { globalState, dispatch } = useContext(Context);
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
        <AdminOverall />
      </div>
    </div>
  );
};

export default Admin;
