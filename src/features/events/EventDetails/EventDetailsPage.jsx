import React, { Component } from "react";
import { Grid } from "semantic-ui-react";
import { toastr } from "react-redux-toastr";
import { connect } from "react-redux";
import { compose } from "redux";
import { withFirestore, firebaseConnect, isEmpty } from "react-redux-firebase";
// Common Components
import LoadingComponent from "../../../app/layout/Loading";
// Custom Components
import EventDetailedHeader from "./EventDetailedHeader";
import EventDetailedInfo from "./EventDetailedInfo";
// Actions
import { openModal } from "../../modals/modalActions";
import { goingToEvent, cancelGoingToEvent } from "../../user/userActions";
// Utils
import { objectToArray } from "../../../app/common/util/helpers";

class EventDetailsPage extends Component {
  state = {
    initialLoading: true
  };

  async componentDidMount() {
    const { firestore, match } = this.props;
    try {
      const event = await firestore.get(`events/${match.params.id}`);

      if (!event.exists) {
        toastr.error("Not found", "This is not the event you are looking for");
        return this.props.history.push("/events");
      }

      this.setState({
        initialLoading: false
      });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const { match, loading, event, auth, openModal, goingToEvent } = this.props;

    if (this.state.initialLoading) return <LoadingComponent inverted={true} />;

    const attendees =
      event &&
      event.attendees &&
      objectToArray(event.attendees).sort(function(a, b) {
        return a.joinDate - b.joinDate;
      });
    const isHost = event.hostUid === auth.uid;
    const isGoing = attendees && attendees.some(a => a.id === auth.uid);
    const authenticated = auth.isLoaded && !auth.isEmpty;

    return (
      <Grid>
        <Grid.Column width={10}>
          <EventDetailedHeader
            event={event}
            loading={loading}
            isHost={isHost}
            isGoing={isGoing}
            authenticated={authenticated}
            openModal={openModal}
            goingToEvent={goingToEvent}
            cancelGoingToEvent={cancelGoingToEvent}
          />
          <EventDetailedInfo event={event} />
        </Grid.Column>
        <Grid.Column width={6} />
      </Grid>
    );
  }
}

const mapStateToProps = ({ firestore, firebase, async }) => {
  let event = {};

  if (firestore.ordered.events && firestore.ordered.events[0]) {
    event = firestore.ordered.events[0];
  }

  return {
    event,
    loading: async.loading,
    auth: firebase.auth
  };
};

export default compose(
  withFirestore,
  connect(
    mapStateToProps,
    { openModal, goingToEvent, cancelGoingToEvent }
  )
)(EventDetailsPage);
