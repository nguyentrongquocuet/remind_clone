import React from "react";
import MUiModal from "@material-ui/core/Modal";
import "./Modal.css";
const Modal = (props) => {
  const content = (
    <MUiModal
      open={props.open}
      onClose={props.onClose}
      container={document.getElementById("modal-hook")}
      className={props.className.wrapper}
      style={{
        ...props.style.wrapper,
        position: "absolute",
        zIndex: 1,
        outline: "none",
      }}
    >
      <div style={props.style.content} className={`${props.className.content}`}>
        {props.closeButton && (
          <span onClick={props.onClose} className="modal__close">
            X
          </span>
        )}
        {props.children}
      </div>
    </MUiModal>
  );
  return content;
};

export default Modal;
