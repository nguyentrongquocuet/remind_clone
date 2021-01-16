import React, { useEffect, useRef } from "react";
import MUiModal from "@material-ui/core/Modal";
import "./Modal.scss";
import { Card } from "@material-ui/core";
const Modal = ({
  classNames = { wrapper: "", content: "" },
  disableAutoFocus,
  disableEnforceFocus,
  header,
  closeButton = true,
  onClose = () => {},
  open = false,
  children,
  transparent,
  ogSize = true,
  ...props
}) => {
  const heightRef = useRef();
  useEffect(() => {
    console.log("check-ref", console.log(heightRef));
  }, [children]);
  const content = (
    <MUiModal
      open={open || false}
      onClose={(e) => {
        onClose ? onClose(e) : e.preventDefault();
      }}
      container={document.getElementById("modal-hook")}
      className={classNames.wrapper}
      disableAutoFocus={disableAutoFocus || true}
      disableEnforceFocus={disableEnforceFocus || true}
    >
      <Card
        id="modal-content"
        className="custom-modal"
        style={transparent && { background: "transparent", boxShadow: "none" }}
      >
        <div className={`${classNames.content}`}>
          <div className="modal__header">
            {header}
            {closeButton && (
              <span onClick={onClose} className="modal__close">
                X
              </span>
            )}
          </div>

          {children}
        </div>
      </Card>
    </MUiModal>
  );
  return content;
};

export default Modal;
