import React, { useEffect, useState } from "react";
import AdminService from "../../../../services/AdminService";
import Loading from "../../../../shared/components/Loading";
import PopupSubject from "../../../../shared/Util/PopupSubject";
import NewUser from "./NewUser";
import "./ModifyUser.scss";
const ModifyUser = ({
  id,
  onUndo = () => {},
  onSuccess = () => {},
  className = "",
}) => {
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const getData = async () => {
      try {
        const rawData = await AdminService.getUserById(id);
        const { data } = rawData;
        console.log(data);
        setUserData(data);
      } catch (error) {
        PopupSubject.next({
          type: "WARN",
          message: error.response ? error.response.data : "Some error occurred",
        });
      }
    };
    getData();
    return () => setUserData(null);
  }, [id]);

  // useEffect(() => {
  //   return onUndo;
  // }, []);

  return (
    <div className={`user-modify__wrapper ${className}`}>
      {userData ? (
        <NewUser
          onSuccess={onSuccess}
          onUndo={onUndo}
          initialMode="modify"
          initialUserData={userData}
        />
      ) : (
        <Loading />
      )}
      {/* <Button
        variant="outlined"
        size="small"
        className="modify-undo"
        onClick={onUndo}
      >
        Cancel
      </Button> */}
    </div>
  );
};

export default ModifyUser;
