import React from "react";
import styled from "styled-components";
import MUiCard from "@material-ui/core/Card";
import "./Card.scss";

export default styled(
  ({ className, style = { borderRadius: "4px" }, children }) => (
    <MUiCard className={className}>{children}</MUiCard>
  )
)`
  border-radius: ${({ style = { borderRadius: "4px" }, ...props }) =>
    style.borderRadius};
`;
