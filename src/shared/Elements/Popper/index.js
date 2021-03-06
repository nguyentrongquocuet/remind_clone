import React from "react";
import { Popper as MUIMopper } from "@material-ui/core/";
import "./Popper.scss";
const Popper = (props) => {
  return (
    <MUIMopper
      style={{
        borderRadius: "4px",
        backgroundColor: props.backgroundColor || "transparent",
        color: props.color || "black",
        width: props.width || "max-content",
      }}
      id={props.id}
      open={props.open}
      anchorEl={props.anchorEl}
      placement={props.placement}
    >
      <div className={`popper__content ${props.className}`}>
        {props.children}
      </div>
    </MUIMopper>
  );
};

export default Popper;
