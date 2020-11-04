import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import "./Loading.scss";
const Loading = ({ style }) => {
  return (
    <div style={style} id="loading">
      <CircularProgress />
    </div>
  );
};

export default Loading;
