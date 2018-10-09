import React from "react";
import { connect } from "react-redux";
// Modals
import RegisterModal from "./RegisterModal";
import LoginModal from "./LoginModal";
import UnauthModal from "./UnauthModal";

const modalLookup = {
  RegisterModal,
  LoginModal,
  UnauthModal
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
