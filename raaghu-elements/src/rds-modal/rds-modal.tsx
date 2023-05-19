import React, { ReactNode } from "react";
import RdsIcon from "../rds-icon";
import "./rds-modal.css";

export interface RdsModalProps {
  modalId: string;
  modalBackdrop?: boolean | "static";
  preventEscapeKey?: boolean;
  size?: "small" | "large" | "extra-large" | "fullscreen" | "default";
  modalAnimation?:
    | "modal fade"
    | "modal fade-scale"
    | "modal fade-rotate"
    | "modal fade-flip";
  showModalFooter?: boolean;
  showModalHeader?: boolean;
  modalData?: any;
  scrollable?: boolean;
  verticallyCentered?: boolean;
  modalbutton?: any;
  children: any;
  modalTitle?: string;
  saveChangesName?: string;
  cancelButtonName?: string;

  // onShow = new EventEmitter<Event>();
  // onClose = new EventEmitter<Event>();
}

const RdsModal = (props: RdsModalProps) => {
  let preventEscapeKey = `${
    props.hasOwnProperty("preventEscapeKey") ? props.preventEscapeKey : true
  }`;
  let Backdrop = `${
    props.hasOwnProperty("modalBackdrop") ? props.modalBackdrop : true
  }`;
  let size = `${
    props.size == "small"
      ? "modal-sm"
      : props.size == "large"
      ? "modal-lg"
      : props.size == "extra-large"
      ? "modal-xl"
      : props.size == "fullscreen"
      ? "modal-fullscreen"
      : ""
  }`;

  let classes = `modal-dialog ${size} ${
    props.scrollable === true ? "modal-dialog-scrollable" : ""
  }
   ${props.verticallyCentered === true ? "modal-dialog-centered" : ""}
    ${props.scrollable === true ? "modal-dialog-centered" : ""}`;

  let modalAnimations = `modal ${
    props.modalAnimation === "modal fade-rotate"
      ? "fade-rotate"
      : props.modalAnimation === "modal fade"
      ? " fade"
      : props.modalAnimation === "modal fade-scale"
      ? "fade-scale"
      : props.modalAnimation === "modal fade-flip"
      ? "fade-flip"
      : " "
  }`;
  
  const OffCanvasBtn = document.querySelectorAll('[data-bs-toggle="modal"]');
  OffCanvasBtn.forEach((element)=>{
    element.addEventListener('click',()=>{
      const allBackdrops = document.querySelectorAll('.modal-backdrop')
      if (allBackdrops.length > 1) {
        for (let i = 0; i < allBackdrops.length - 1; i++) {
          allBackdrops[i].remove();
        }
      }
    })
  })
  return (
    <>
      {/* Button trigger modal */}
      {props.modalbutton && (
        <div className="cursor-pointer"
          data-bs-toggle="modal"
          data-bs-target={`#${props.modalId}`}
        >
          {props.modalbutton}
        </div>
      )}

      {/*  Modal  */}

      <div
        className={modalAnimations}
        id={props.modalId}
        data-bs-backdrop={Backdrop}
        data-bs-keyboard={preventEscapeKey}
        tabIndex={-1}
        aria-labelledby={`#${props.modalId}Label`}
        aria-hidden="true"
      >
        <div className={classes}>
          <div className="modal-content">
            {props.showModalHeader && (
              <div className="modal-header">
                <h5 className="modal-title">{props.modalTitle}</h5>
                <button
                  key="modalHeader"
                  type="button"
                  className="btn-close btn-danger"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
            )}

            <div className="modal-body"> {props.children}</div>
            {props.showModalFooter && (
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  data-bs-dismiss="modal"
                >
                  {props.cancelButtonName}
                </button>
                <button type="button" className="btn btn-primary ms-2">
                  {props.saveChangesName}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RdsModal;
