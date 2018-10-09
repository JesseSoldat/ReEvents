import React, { Component } from "react";
import { Grid } from "semantic-ui-react";
import { connect } from "react-redux";
import { firestoreConnect, isEmpty } from "react-redux-firebase";
import { compose } from "redux";
import { toastr } from "react-redux-toastr";
// Common Components
import LoadingComponent from "../../../app/layout/Loading";
// Custom Components
import UserDetailedHeader from "./UserDetailedHeader";
// Queries
import { userDetailedQuery } from "../userQueries";
// Actions
import { getUserEvents } from "../userActions";

class UserDetailsPage extends Component {
  async componentDidMount() {
    const user = await this.props.firestore.get(
      `users/${this.props.match.params.id}`
    );
    // console.log("user", user);

    if (!user.exists) {
      toastr.error("Not found", "This is not the user you are looking for");
      this.props.history.push("/error");
    }

    await this.props.getUserEvents(this.props.userUid);
  }

  render() {
    const {
      profile,
      photos,
      auth,
      match,
      requesting,
      events,
      eventsLoading
    } = this.props;

    const loading = requesting[`users/${match.params.id}`];

    if (loading) return <LoadingComponent inverted={true} />;
    return (
      <Grid>
        <UserDetailedHeader profile={profile} />
      </Grid>
    );
  }
}

const mapStateToProps = ({ async, events, firebase, firestore }, ownProps) => {
  let userUid = null;
  let profile = {};

  if (ownProps.match.params.id === firebase.auth.uid) {
    profile = firebase.profile;
    userUid = firebase.auth.uid;
    // console.log("profile#1", profile);
  } else {
    profile =
      !isEmpty(firestore.ordered.profile) && firestore.ordered.profile[0];
    userUid = ownProps.match.params.id;
    // console.log("profile#2", profile);
  }

  return {
    profile,
    userUid,
    events,
    eventsLoading: async.loading,
    auth: firebase.auth,
    photos: firestore.ordered.photos,
    requesting: firestore.status.requesting
  };
};

export default compose(
  connect(
    mapStateToProps,
    { getUserEvents }
  ),
  firestoreConnect((auth, userUid, match) =>
    userDetailedQuery(auth, userUid, match)
  )
)(UserDetailsPage);
