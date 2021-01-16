import React, { useState, useEffect } from "react";
import Card from "shared/Elements/Card";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Table from "../../Elements/Table";
import moment from "moment";
import "./ViewClass.scss";
import Loading from "shared/components/Loading";
import AdminService from "services/AdminService";
import { Avatar } from "@material-ui/core";
import ROLE from "shared/Util/ROLE";
import ACTION from "../../Configs/Actions";
import PopupSubject from "shared/Util/PopupSubject";
const ViewClass = ({ classId, className }) => {
  const [classData, setClassData] = useState({
    classInfo: null,
    ownerInfo: null,
  });
  const [memberData, setMemberData] = useState(null);
  useEffect(() => {
    if (classId) {
      getClassData();
    }
  }, [classId]);

  const getMember = async (e, expanded) => {
    e.preventDefault();
    if (expanded) {
      const { data } = await AdminService.getClassMember(classId);
      setMemberData(data.memberData);
    }
  };

  const deleteMember = (userId) => {
    AdminService.removeClassMember(classId, userId);
  };

  const actionHandle = (e) => {
    const actionType = e.currentTarget.getAttribute("user-action");
    const userId = e.currentTarget.getAttribute("user-id");
    switch (actionType) {
      case "DELETE_MEMBER":
        PopupSubject.next({
          type: "CONFIRM",
          message: "Do you want to delete from this class?",
          onConfirm: (e) => {
            deleteMember(userId);
          },
          onCancel: null,
        });
    }
  };

  const getClassData = async () => {
    const { data } = await AdminService.getFullClassInfo(classId);
    setClassData(data);
  };
  const { classInfo, ownerInfo } = classData;
  return (
    <Card className={"admin-view-class " + className}>
      <div className="flex f-column fullwidth">
        {classInfo ? (
          <>
            <div className="overview">
              <Avatar className="big" src={classInfo.avatar} />
              {/* <div className=""> */}
              <br />
              <p className="name_role">
                <h3 className="name">{classInfo.name}</h3>
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
                </p>
              </p>
              {/* </div> */}
            </div>
            <div className="spec-info owner-info">
              <p className="member">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-people-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                  <path
                    fillRule="evenodd"
                    d="M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z"
                  />
                  <path d="M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
                </svg>
                <span>{classInfo.member}</span>
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
                <span>{moment(classInfo.createAt).format("YYYY-MM-DD")}</span>
              </p>
              <p className="creator-info">
                <Avatar className="small" src={ownerInfo.avatar} />
                <span>{ownerInfo.name}</span>
              </p>
            </div>
            <div className="additional">
              <Accordion onChange={getMember}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <span className="font-weight-bold">
                    Members ({classInfo.member})
                  </span>
                </AccordionSummary>

                <AccordionDetails>
                  {memberData === null ? (
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
                  ) : memberData.length === 0 ? (
                    "That's weird"
                  ) : (
                    <Table
                      actions={ACTION.CLASS.USER}
                      data={memberData}
                      userData
                      onAction={actionHandle}
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

export default ViewClass;
