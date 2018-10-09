import React from "react";
import { Modal, Button, Divider } from "semantic-ui-react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
// Actions
import { closeModal, openModal } from "./modalActions";

const UnauthModal = ({ history, location, openModal, closeModal }) => {
  const handleCloseModal = () => {
    if (location.pathname.includes("/event")) {
      closeModal();
    } else {
      history.goBack();
      closeModal();
    }
  };

  return (
    <Modal size="mini" open={true} onClose={handleCloseModal}>
      <Modal.Header>You need to be signed in to do that!</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <p>Please either login or register to see this page</p>
          <Button.Group widths={4}>
            <Button fluid color="teal" onClick={() => openModal("LoginModal")}>
              Login
            </Button>
            <Button.Or />
            <Button fluid positive onClick={() => openModal("RegisterModal")}>
              Register
            </Button>
          </Button.Group>
          <Divider />
          <div style={{ textAlign: "center" }}>
            <p>Or click cancel to continue as a guest</p>
            <Button onClick={handleCloseModal}>Cancel</Button>
          </div>
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
};

export default withRouter(
  connect(
    null,
    { closeModal, openModal }
  )(UnauthModal)
);
