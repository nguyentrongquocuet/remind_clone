import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import UserService from "../../../services/UserService";
import PopupSubject from "../../Util/PopupSubject";
const ConnectChildPage = () => {
  const history = useHistory();
  const connectToken = new URLSearchParams(history.location.search).get(
    "token"
  );
  useEffect(() => {
    const connect = async () => {
      try {
        const connectStatus = await UserService.connectChild(connectToken);
        PopupSubject.next({
          type: "SUCCESS",
          message: connectStatus.data,
          showTime: 4,
        });
      } catch (error) {
        if (error.response) {
          PopupSubject.next({
            type: "WARN",
            message: error.response.data,
            showTime: 4,
          });
        }
      } finally {
        history.push("/");
      }
    };
    connect();
  }, []);
  return <div></div>;
};

export default ConnectChildPage;
