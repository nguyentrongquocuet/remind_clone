import React, { useContext } from "react";
import { Context } from "../../shared/Util/context";

import { useParams } from "react-router-dom";
import Sidebar from "./components/Sidebar";
const Class = () => {
  return (
    <div className="main">
      <Sidebar />
    </div>
  );
};

export default Class;
