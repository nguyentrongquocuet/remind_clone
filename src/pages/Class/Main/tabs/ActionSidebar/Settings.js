import React from "react";
import "./Settings.scss";
import Button from "../../../../../shared/Elements/Button";
const Settings = ({ classId }) => {
  return (
    <div className="center settings">
      <Button className="leaveclass" variant="outlined" color="secondary">
        Leave Class
      </Button>
    </div>
  );
};

export default Settings;
