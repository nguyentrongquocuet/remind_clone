import React from "react";
import styled from "styled-components";
import MUiCard from "@material-ui/core/Card";
import "./Card.css";

export default styled(({ className, style, children }) => (
  <MUiCard className={className}>{children}</MUiCard>
))`
  border-radius: ${(props) => props.style.borderRadius};
`;
