import React from "react";
import { connect } from "react-redux";
import { Grid } from "semantic-ui-react";
import { Switch, Route, Redirect } from "react-router-dom";
// Pages
import SettingsNav from "./SettingsNav";
import BasicPage from "./BasicPage";
import AboutPage from "./AboutPage";
import PhotosPage from "./PhotosPage";
import AccountPage from "./AccountPage";
// Actions
import { updateProfile } from "../userActions";
import { updatePassword } from "../../auth/authActions";

const SettingsDashboard = ({
  user,
  providerId,
  updateProfile,
  updatePassword
}) => {
  return (
    <Grid>
      <Grid.Column width={12}>
        <Switch>
          <Redirect exact from="/settings" to="/settings/basic" />
          <Route
            path="/settings/basic"
            render={() => (
              <BasicPage initialValues={user} updateProfile={updateProfile} />
            )}
          />
          <Route
            path="/settings/about"
            render={() => (
              <AboutPage updateProfile={updateProfile} initialValues={user} />
            )}
          />
          <Route path="/settings/photos" component={PhotosPage} />
          <Route
            path="/settings/account"
            render={() => (
              <AccountPage
                updatePassword={updatePassword}
                providerId={providerId}
              />
            )}
          />
        </Switch>
      </Grid.Column>
      <Grid.Column width={4}>
        <SettingsNav />
      </Grid.Column>
    </Grid>
  );
};

const mapStateToProps = ({ firebase }) => {
  let user = {
    city: ""
  };

  if (firebase.profile) {
    // console.log("Profile", firebase.profile);
    user = firebase.profile;
  }

  return {
    providerId: firebase.auth.providerData[0].providerId,
    user
  };
};

export default connect(
  mapStateToProps,
  { updateProfile, updatePassword }
)(SettingsDashboard);
