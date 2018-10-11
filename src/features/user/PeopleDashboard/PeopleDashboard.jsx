import React from "react";
import { Grid, Segment, Header, Card } from "semantic-ui-react";
import { connect } from "react-redux";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
// Custom Components
import PersonCard from "./PersonCard";

const PeopleDashboard = ({ followings, followers }) => {
  return (
    <Grid>
      <Grid.Column width={16}>
        <Segment>
          <Header dividing content="People following me" />
          <Card.Group itemsPerRow={8} stackable>
            {followers && followers.length ? (
              followers.map(follower => (
                <PersonCard key={follower.id} user={follower} />
              ))
            ) : (
              <Header style={{ padding: "20px 10px" }} as="h5">
                No one is following you.
              </Header>
            )}
          </Card.Group>
        </Segment>
        <Segment>
          <Header dividing content="People I'm following" />
          <Card.Group itemsPerRow={8} stackable>
            {followings && followings.length ? (
              followings.map(following => (
                <PersonCard key={following.id} user={following} />
              ))
            ) : (
              <Header style={{ padding: "20px 10px" }} as="h5">
                You are not following anyone.
              </Header>
            )}
          </Card.Group>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

const query = ({ auth }) => {
  return [
    {
      collection: "users",
      doc: auth.uid,
      subcollections: [{ collection: "following" }],
      storeAs: "following"
    },
    {
      collection: "users",
      doc: auth.uid,
      subcollections: [{ collection: "followers" }],
      storeAs: "followers"
    }
  ];
};

const mapStateToProps = state => ({
  followings: state.firestore.ordered.following,
  followers: state.firestore.ordered.followers,
  auth: state.firebase.auth
});

export default compose(
  connect(mapStateToProps),
  firestoreConnect(props => query(props))
)(PeopleDashboard);
