import React, { useEffect, useReducer } from "react";
import AdminService from "../../../services/AdminService";
import InfoCard from "../Elements/InfoCard";
import Loading from "../../../shared/components/Loading";
import "./Overall.scss";

const overallElements = [
  {
    icon: "users.svg",
    text: "Users",
    footerText: "Updated every 30 minutes",
    path: "users",
    field: "userAmount",
  },
  {
    icon: "classes.svg",
    text: "Classes",
    footerText: "Updated every 30 minutes",
    path: "classes",
    field: "classAmount",
  },
  {
    icon: "visitors.svg",
    text: "Visitors",
    footerText: "Updated every 30 minutes",
    path: "traffic",
    field: "visitorAmount",
  },
  {
    icon: "supports.svg",
    text: "Support Requests",
    footerText: "Updated every 30 minutes",
    path: "support",
    unavailable: true,
  },
  {
    icon: "traffic.svg",
    text: "Requests to web",
    footerText: "Updated every 30 minutes",
    path: "traffic",
    field: "requestAmount",
  },
];

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_USERS":
      return { ...state, userAmount: action.payload };
    case "SET_CLASSES":
      return { ...state, classAmount: action.payload };
    case "SET_VISITORS":
      return { ...state, visitorAmount: action.payload };
    case "SET_REQUESTS":
      return { ...state, requestAmount: action.payload };
  }
};

const getData = [
  { dispatchCommand: "SET_USERS", fn: () => AdminService.getUserAmount() },
  { dispatchCommand: "SET_CLASSES", fn: () => AdminService.getClassAmount() },
  {
    dispatchCommand: "SET_VISITORS",
    fn: () => AdminService.getVisitorAmount(),
  },
  {
    dispatchCommand: "SET_REQUESTS",
    fn: () =>
      AdminService.getRequestAmount().then((data) => {
        return { data: data.data.requests };
      }),
  },
];

const AdminOverall = () => {
  const [overallState, dispatch] = useReducer(reducer, {
    userAmount: null,
    classAmount: null,
    visitorAmount: null,
    requestAmount: null,
  });
  useEffect(() => {
    getData.map((method) =>
      method.fn().then((data) =>
        dispatch({
          type: method.dispatchCommand,
          payload: data.data,
        })
      )
    );
  }, []);
  return (
    <div className="admin-overall">
      <div className="overall-info">
        {overallElements.map((element, key) =>
          overallState ? (
            <InfoCard
              data={overallState[element.field]}
              key={key}
              // amount={10000}
              {...element}
              unavailable={element.unavailable}
            />
          ) : (
            <Loading />
          )
        )}
      </div>
    </div>
  );
};

export default AdminOverall;
