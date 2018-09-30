import React from "react";
import { connect } from "react-redux";
// Modals
import LoginModal from "./LoginModal";

const modalLookup = {
  LoginModal
};

const ModalManager = ({ currentModal }) => {
  let renderedModal;

  if (currentModal) {
    const { modalType, modalProps } = currentModal;
    const ModalComponent = modalLookup[modalType];

    renderedModal = <ModalComponent {...modalProps} />;
  }
  return <span>{renderedModal}</span>;
};

const mapStateToProps = ({ modals }) => ({
  currentModal: modals
});

export default connect(mapStateToProps)(ModalManager);
