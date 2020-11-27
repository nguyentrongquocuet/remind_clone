import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { Card } from "@material-ui/core";
import { Context } from "../../Util/context";
import Modal from "../../Elements/Modal";
import Loading from "../Loading";
import UserService from "../../../services/UserService";
import "../Header/Header.scss";
import "./ChooseRole.scss";
import PopupSubject from "../../Util/PopupSubject";
const ChooseRole = () => {
  const { dispatch, globalState } = useContext(Context);
  const [processing, setProcessing] = useState(false);
  const setRole = async (roleId) => {
    if (!processing) {
      try {
        setProcessing(true);
        const newRole = await UserService.setRole(roleId);
        dispatch({
          type: "SET_ROLE",
          id: newRole.data.classId,
          payload: newRole.data.role,
        });
      } catch (error) {
        error.response &&
          PopupSubject.next({
            type: "ERROR",
            message: error.response
              ? error.response.data
              : "Some errors occured",
            showTime: 5,
          });
      } finally {
        setProcessing(false);
      }
    }
  };
  return (
    <div className="chooserole">
      <Modal transparent classNames={{ wrapper: "center" }} open={processing}>
        <Loading />
      </Modal>
      <div className="header">
        <div className="header__logo flex-align">
          <NavLink to="/">
            <p>REMIND</p>
          </NavLink>
        </div>
      </div>
      <main className="chooserole__main">
        <h1>Tell us about yourself!</h1>
        <div className="roles">
          <Card className="role" onClick={() => setRole(0)}>
            <h4>Im a teacher</h4>
            <p>Teacher, coach, club adviser, organizer, etc</p>
            <img
              className="role__img"
              src={window.location.origin + "/teacher.svg"}
              alt="teacher"
            />
          </Card>
          <Card className="role" onClick={() => setRole(1)}>
            <h4>Im a student</h4>
            <p>
              Student in a class, member of a sports team, club participant, etc
            </p>
            <img
              className="role__img"
              src={window.location.origin + "/student.svg"}
              alt="Student"
            />
          </Card>
          <Card className="role" onClick={() => setRole(2)}>
            <h4>Im a parent</h4>
            <p>Parent or guardian</p>
            <img
              className="role__img"
              src={window.location.origin + "/parent.svg"}
              alt="Student"
            />
          </Card>
        </div>
      </main>
      <div className="chooserole__escape">
        <p>Logged In As {globalState.userData.name}</p>
        <p>
          Not you?
          <span
            className="logout"
            onClick={(e) => dispatch({ type: "LOGOUT" })}
          >
            LogOut
          </span>
        </p>
      </div>
    </div>
  );
};

export default ChooseRole;
