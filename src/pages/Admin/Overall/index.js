import React from "react";
import InfoCard from "../Elements/InfoCard";
import "./Overall.scss";

const overallElements = [
  {
    icon: "users.svg",
    text: "Users",
    footerText: "Updated every 30 minutes",
    path: "users",
  },
  {
    icon: "classes.svg",
    text: "Classes",
    footerText: "Updated every 30 minutes",
    path: "classes",
  },
  {
    icon: "visitors.svg",
    text: "Visitors",
    footerText: "Updated every 30 minutes",
  },
  {
    icon: "supports.svg",
    text: "Support Requests",
    footerText: "Updated every 30 minutes",
    path: "reports",
  },
];

const AdminOverall = () => {
  return (
    <div className="admin-overall">
      <div className="overall-info">
        {overallElements.map((element, key) => (
          <InfoCard key={key} amount={10000} {...element} />
        ))}
      </div>
    </div>
  );
};

export default AdminOverall;
