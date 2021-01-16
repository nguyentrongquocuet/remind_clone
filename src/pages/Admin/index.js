import React, { useContext, useState } from "react";
import Header from "../../shared/components/Header";
import AdminSidebar from "./Sidebar";
import PopUp from "../../shared/Elements/PopUp";
// import AdminOverall from "./Overall";
// import { useHistory, useParams } from "react-router-dom";
import Button from "../../shared/Elements/Button";
import { Context } from "../../shared/Util/context";
// import UserManage from "./UserManage";
import Workspace from "./Workspace";
import "./Admin.scss";
const Admin = () => {
  // const history = useHistory();
  // const { action, mode } = useParams();
  // const [curMode, setCurMode] = useState(mode);
  const { dispatch } = useContext(Context);
  const [popupData, setPopupData] = useState(null);
  const clearPopup = (e) => setPopupData(null);

  // useEffect(() => {
  //   curMode !== mode && setCurMode(mode);
  // }, [mode]);
  return (
    <>
      {popupData && <PopUp onClose={clearPopup} content={popupData} />}
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
          <Workspace />
        </div>
      </div>
    </>
  );
};

export default Admin;
