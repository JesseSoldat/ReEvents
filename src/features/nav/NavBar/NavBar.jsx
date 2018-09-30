import React from "react";
import { NavLink, Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Menu, Container, Button } from "semantic-ui-react";
// Components
import SignedOutMenu from "../Menus/SignedOutMenu";
// Actions
import { openModal } from "../../modals/modalActions";

const NavBar = ({ openModal }) => {
  const handleRegister = () => openModal("RegisterModal");

  return (
    <Menu inverted fixed="top">
      <Container>
        <Menu.Item as={Link} to="/" header>
          <img
            src="/assets/logo.png"
            alt="logo"
            style={{ paddingRight: "5px" }}
          />
          Re-vents
        </Menu.Item>
        <Menu.Item as={NavLink} to="/events" name="Events" />
        <SignedOutMenu register={handleRegister} />
      </Container>
    </Menu>
  );
};

const mapStateToProps = () => ({});

export default withRouter(
  connect(
    mapStateToProps,
    { openModal }
  )(NavBar)
);
