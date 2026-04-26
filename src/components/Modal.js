import React from "react";
import "./Modal.css";

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <h3>{title}</h3>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
