import React from "react";
import { createPortal } from "react-dom";
import "./Modal.css";
const Modal = (props) => {
  const content = (
    <div style={props.style} className={`modal ${props.className}`}>
      <span onClick={props.onClose} className="modal__close">
        X
      </span>
      {props.children}
    </div>
  );
  return createPortal(content, document.getElementById("modal-hook"));
};

export default Modal;
