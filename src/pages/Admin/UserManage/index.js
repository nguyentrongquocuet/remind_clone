import React, { useEffect, useState } from "react";
import AdminService from "../../../services/AdminService";
import Loading from "../../../shared/components/Loading";
import "./UserManage.scss";
const UserManage = () => {
  const [userList, setUserList] = useState(null);
  useEffect(() => {
    const getList = async () => {
      const { data } = await AdminService.getUsers();
      console.log(data);
      setUserList(data);
    };
    getList();
  }, []);
  return (
    <div>
      {userList ? JSON.stringify(userList) : <Loading />}
      User Manage
    </div>
  );
};

export default UserManage;
