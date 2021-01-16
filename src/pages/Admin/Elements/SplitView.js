import React from "react";

import "./SplitView.scss";

const SplitView = ({ wrapperClassName = "", leftSide, rightSide }) => {
  return (
    <div className={`split-view ${wrapperClassName}`}>
      {leftSide}
      {rightSide}
    </div>
  );
};

export default SplitView;
