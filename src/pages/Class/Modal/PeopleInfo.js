import { Avatar, Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import MessageService from "../../../services/MessageService";
import UserService from "../../../services/UserService";
import Loading from "../../../shared/components/Loading";
import PopupSubject from "../../../shared/Util/PopupSubject";
import ROLE from "../../../shared/Util/ROLE";
import "./PeopleInfo.scss";

//display name, role, family,
const PeopleInfo = ({ id, onClose }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [initializing, setInitializing] = useState(false);
  const history = useHistory();
  const { classId } = useParams();
  useEffect(() => {
    const getInfo = async () => {
      try {
        const userData = await UserService.getUserInfo(id);
        setUserInfo(userData.data);
      } catch (error) {
        PopupSubject.next({
          type: "WARN",
          message: error.response
            ? error.response.data
            : "Something went wrong",
          showTime: 4,
        });
      }
    };
    getInfo();
  }, [id]);
  const privateChatPrepare = async () => {
    try {
      setInitializing(true);
      const privateRoomData = await MessageService.initialPrivateRoom(id);
      history.push(`/classes/${classId}/private/${id}`);
      console.log(privateRoomData);
    } catch (error) {
      if (error.response) {
        PopupSubject.next({
          type: "WARN",
          message: error.response.data,
          showTime: 4,
        });
      }
    } finally {
      setInitializing(false);
      onClose();
    }
  };
  return userInfo ? (
    <div className="people-info">
      <span className="close" onClick={onClose}>
        Close
      </span>
      <div className="info">
        <Avatar className="medium" src={userInfo.avatar} />
        <p className="name">
          <span>{userInfo.firstName} </span>
          <span>{userInfo.lastName}</span>
        </p>
        <span className="role">{ROLE[userInfo.role]}</span>
      </div>
      <div className="people-info__actions">
        <Button
          onClick={privateChatPrepare}
          variant="contained"
          color="primary"
        >
          {initializing ? <Loading /> : "Send Message"}
        </Button>
      </div>
      {/* TODO: view family and classshared */}
      <div className="family">coming soon</div>
      <div className="classshared">coming soon</div>
    </div>
  ) : (
    <Loading className="people-info" />
  );
};

export default PeopleInfo;
