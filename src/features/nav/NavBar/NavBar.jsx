import React from "react";
import { NavLink, Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { withFirebase } from "react-redux-firebase";
import { Menu, Container, Button } from "semantic-ui-react";
// Components
import SignedOutMenu from "../Menus/SignedOutMenu";
import SignedInMenu from "../Menus/SignedInMenu";
// Actions
import { openModal } from "../../modals/modalActions";

const NavBar = ({ openModal, auth, profile, firebase, history }) => {
  const handleRegister = () => openModal("RegisterModal");

  const handleSignIn = () => openModal("LoginModal");

  const handleSignOut = () => {
    firebase.logout();
    history.push("/");
  };

  const authenticated = auth.isLoaded && !auth.isEmpty;

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
        <Menu.Item as={NavLink} to="/people" name="People" />
        {authenticated && (
          <Menu.Item>
            <Button
              as={Link}
              to="/createEvent"
              floated="right"
              positive
              inverted
              content="Create Event"
            />
          </Menu.Item>
        )}
        {authenticated ? (
          <SignedInMenu auth={auth} profile={profile} signOut={handleSignOut} />
        ) : (
          <SignedOutMenu register={handleRegister} signIn={handleSignIn} />
        )}
      </Container>
    </Menu>
  );
};

const mapStateToProps = ({ firebase }) => ({
  auth: firebase.auth,
  profile: firebase.profile
});

export default withRouter(
  withFirebase(
    connect(
      mapStateToProps,
      { openModal }
    )(NavBar)
  )
);
