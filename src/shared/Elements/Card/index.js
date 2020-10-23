import React from "react";
import MUiCard from "@material-ui/core/Card";

const Card = (props) => {
  return <MUiCard {...props}>{props.children}</MUiCard>;
};

export default Card;
