import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import ClassService from "../../../services/ClassService";
import { Context } from "../../Util/context";
import PopupSubject from "../../Util/PopupSubject";

const JoinClassPage = () => {
  const history = useHistory();
  const classId = new URLSearchParams(history.location.search).get("classId");
  const { dispatch } = useContext(Context);
  useEffect(() => {
    const join = async () => {
      try {
        const response = await ClassService.joinClass(classId);
        dispatch({
          type: "ADD_CLASS",
          payload: response.data,
        });
        PopupSubject.next({
          type: "SUCCESS",
          message: `You've joined ${response.data.name}`,
          showTime: 5,
        });
        history.push(`/classes/${classId}`);
      } catch (error) {
        if (error.response) {
          if (error.response.status === 409) {
            history.push(`/classes/${classId}`);
          } else {
            history.push(`/classes`);
          }
          PopupSubject.next({
            type: "WARN",
            message: error.response.data,
            showTime: 4,
          });
        }
      }
    };
    join();
  }, [classId]);
  return <div></div>;
};

export default JoinClassPage;
