import React from "react";
import "./ClassItem.scss";
const ClassItem = ({ icon, id, name, onClick }) => {
  return (
    <div onClick={onClick} className="sidebar__element__e classitem">
      <img
        className="small circle"
        src={
          icon ||
          "https://remind.imgix.net/2e24f4f6-1f7e-4dad-aab9-94f69e462d45/math.svg"
        }
        alt={name}
      />
      <p>{name}</p>
    </div>
  );
};

export default ClassItem;
