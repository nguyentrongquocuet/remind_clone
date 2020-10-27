import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

import "./Class.scss";
import ClassMain from "./Main";
import ClassSidebar from "./Sidebar";
const Class = () => {
  let history = useHistory();
  useEffect(() => {
    console.log(1111111111111);
    history.push("/classes/1");
  }, []);

  return (
    <div className="main">
      <ClassSidebar />
      <ClassMain />
    </div>
  );
};

export default Class;
