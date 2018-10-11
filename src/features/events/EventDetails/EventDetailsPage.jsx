import React, { Component } from "react";
import { Grid } from "semantic-ui-react";
import { connect } from "react-redux";
import { compose } from "redux";
// Common Components
import LoadingComponent from "../../../app/layout/Loading";
// Custom Components
import EventDetailedHeader from "./EventDetailedHeader";
import EventDetailedInfo from "./EventDetailedInfo";
import EventDetailedSidebar from "./EventDetailedSidebar";
// Actions
import { openModal } from "../../modals/modalActions";
import { goingToEvent, cancelGoingToEvent } from "../../user/userActions";
import { getEvent, resetEvent } from "../eventActions";
// Utils
import { objectToArray } from "../../../app/common/util/helpers";

class EventDetailsPage extends Component {
  state = {
    initialLoading: true
  };

  componentDidMount() {
    const { getEvent, match } = this.props;
    getEvent(match.params.id);
  }

  async componentWillUnmount() {
    this.props.resetEvent();
  }

  render() {
    const {
      loading,
      events,
      auth,
      openModal,
      goingToEvent,
      cancelGoingToEvent
    } = this.props;

    if (loading) return <LoadingComponent inverted={true} />;

    if (events && events.length === 0) {
      return <div>There is no event details</div>;
    }

    const event = events[0];

    const attendees =
      event &&
      event.attendees &&
      objectToArray(event.attendees).sort(function(a, b) {
        return a.joinDate - b.joinDate;
      });

    const isGoing = attendees && attendees.some(a => a.id === auth.uid);

    const isHost = event.hostUid === auth.uid;

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
        <Grid.Column width={6}>
          <EventDetailedSidebar attendees={attendees} />
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = ({ events, firebase, async }) => {
  return {
    events: events,
    loading: async.loading,
    auth: firebase.auth
  };
};

export default compose(
  connect(
    mapStateToProps,
    { openModal, goingToEvent, cancelGoingToEvent, getEvent, resetEvent }
  )(EventDetailsPage)
);
