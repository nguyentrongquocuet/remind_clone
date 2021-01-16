import { Avatar } from "@material-ui/core";
import React, { useEffect, useReducer, useState } from "react";
import AdminService from "services/AdminService";
import Loading from "shared/components/Loading";
import PopupSubject from "shared/Util/PopupSubject";
import EmailIcon from "@material-ui/icons/Email";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Card from "../../../../shared/Elements/Card";
import Table from "../../Elements/Table";
import moment from "moment";
import ROLE from "shared/Util/ROLE";
import ACTION from "pages/Admin/Configs/Actions";

import "./UserView.scss";

const addDataReducer = (state, action) => {
  console.log("check-classes", action.payload);
  switch (action.type) {
    case "SET_CLASSES":
      return { ...state, classes: action.payload };
    case "SET_RELATIONSHIPS":
      return { ...state, relationships: action.payload };
    case "CLEAR_DATA":
      return {};
  }
};

const UserView = ({ id, className = "" }) => {
  const [userData, setUserData] = useState();
  const [additionalData, setAdditionalData] = useReducer(addDataReducer, {
    classes: null,
    relationships: null,
  });
  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data } = await AdminService.getUserById(id);
        setUserData(data);
      } catch (error) {
        PopupSubject.next({
          type: "WARN",
          message: error.response
            ? error.response.data
            : "Something went wrong!",
          showTime: 5,
        });
      }
    };
    getUserData();
  }, [id]);
  const getClasses = async (e, expanded) => {
    e.preventDefault();
    if (expanded) {
      const { data } = await AdminService.getUsersClasses(id);
      setAdditionalData({ type: "SET_CLASSES", payload: data.classes });
    }
  };

  const getRelationships = async (e, expanded) => {
    e.preventDefault();
    if (expanded) {
      const { data } = await AdminService.getUsersRelationships(id);
      setAdditionalData({
        type: "SET_RELATIONSHIPS",
        payload: data.relationships,
      });
    }
  };

  const actionHandle = {
    user: (e) => {
      const actionType = e.currentTarget.getAttribute("class-action");
      const classId = e.currentTarget.getAttribute("class-id");
      switch (actionType) {
        case "DELETE_MEMBER":
          PopupSubject.next({
            type: "CONFIRM",
            message: "Do you want to delete from this class?",
            onConfirm: (e) => {
              deleteMember(classId);
            },
            onCancel: null,
          });
      }
    },
    relationship: (e) => {
      const userAction = e.currentTarget.getAttribute("user-action");
      const userId = e.currentTarget.getAttribute("user-id");
      if (userAction === "DELETE_RELATIONSHIP") {
        PopupSubject.next({
          type: "CONFIRM",
          message: "Do you want to delete this relationship?",
          onConfirm: (e) => {
            removeRelationship(userId, userData.id);
          },
          onCancel: null,
        });
      }
    },
  };

  const deleteMember = (classId) => {
    AdminService.removeClassMember(classId, userData.id);
  };

  const removeRelationship = async (firstId, secondId) => {
    AdminService.removeRelationship(firstId, secondId);
  };

  return (
    <Card className={"admin-view-user " + className}>
      <div>
        {userData ? (
          <>
            <div className="overview">
              <Avatar className="big" src={userData.avatar} />
              {/* <div className=""> */}
              <p className="name_role">
                <h3 className="name">{userData.name}</h3>
                <p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-person-lines-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zm.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2z" />
                  </svg>
                  <span className="role">{ROLE[userData.role] || "Unset"}</span>
                </p>
              </p>
              {/* </div> */}
            </div>
            <div className="spec-info">
              <p className="email">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-envelope-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555zM0 4.697v7.104l5.803-3.558L0 4.697zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757zm3.436-.586L16 11.801V4.697l-5.803 3.546z" />
                </svg>
                <span>{userData.email}</span>
              </p>
              <p className="birthday">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-calendar-date-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4V.5zm5.402 9.746c.625 0 1.184-.484 1.184-1.18 0-.832-.527-1.23-1.16-1.23-.586 0-1.168.387-1.168 1.21 0 .817.543 1.2 1.144 1.2z" />
                  <path d="M16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2zm-6.664-1.21c-1.11 0-1.656-.767-1.703-1.407h.683c.043.37.387.82 1.051.82.844 0 1.301-.848 1.305-2.164h-.027c-.153.414-.637.79-1.383.79-.852 0-1.676-.61-1.676-1.77 0-1.137.871-1.809 1.797-1.809 1.172 0 1.953.734 1.953 2.668 0 1.805-.742 2.871-2 2.871zm-2.89-5.435v5.332H5.77V8.079h-.012c-.29.156-.883.52-1.258.777V8.16a12.6 12.6 0 0 1 1.313-.805h.632z" />
                </svg>
                <span>{moment(userData.birthday).format("YYYY-MM-DD")}</span>
              </p>
            </div>
            <div className="additional">
              <Accordion onChange={getClasses}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <span className="font-weight-bold">Classes</span>
                </AccordionSummary>

                <AccordionDetails>
                  {additionalData.classes == null ? (
                    <div className="progress progress-small">
                      <div
                        className="progress-bar progress-bar-striped progress-bar-animated bg-info"
                        role="progressbar"
                        aria-valuenow="75"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        style={{ width: "75%" }}
                      ></div>
                    </div>
                  ) : additionalData.classes.length === 0 ? (
                    "The user has not taken any classes"
                  ) : (
                    <Table
                      actions={ACTION.CLASS.USER}
                      data={additionalData.classes}
                      classData
                      onAction={actionHandle.user}
                    />
                  )}
                </AccordionDetails>
              </Accordion>
              <Accordion onChange={getRelationships}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                >
                  <span className="font-weight-bold">Relationships</span>
                </AccordionSummary>
                <AccordionDetails>
                  {additionalData.relationships == null ? (
                    <div className="progress progress-small">
                      <div
                        className="progress-bar progress-bar-striped progress-bar-animated bg-info"
                        role="progressbar"
                        aria-valuenow="75"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        style={{ width: "75%" }}
                      ></div>
                    </div>
                  ) : additionalData.relationships.length === 0 ? (
                    "The user has not taken any relationships"
                  ) : (
                    <Table
                      actions={ACTION.GLOBAL.RELATIONSHIP}
                      data={additionalData.relationships}
                      userData
                      onAction={actionHandle.relationship}
                    />
                  )}
                </AccordionDetails>
              </Accordion>
            </div>
          </>
        ) : (
          <Loading />
        )}
      </div>
    </Card>
  );
};

export default UserView;
