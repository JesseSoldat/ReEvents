import React, { Component } from "react";
import { Grid, Loader } from "semantic-ui-react";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
// Common Components
import LoadingComponent from "../../../app/layout/Loading";
// Custom Components
import EventList from "../EventList/EventList";
import EventActivity from "../EventActivity/EventActivity";
// Actions
import { getEventsForDashboard, resetEvents } from "../eventActions";

class EventDashboard extends Component {
  state = {
    loadingInitial: true,
    loadedEvents: [],
    moreEvents: false,
    noEvents: true,
    contextRef: {}
  };

  async componentDidMount() {
    let next = await this.props.getEventsForDashboard();

    if (next && next.docs && next.docs.length >= 1) {
      this.setState({ noEvents: false });
    }

    if (next && next.docs && next.docs.length > 1) {
      this.setState({
        moreEvents: true,
        loadingInitial: false
      });
    } else {
      this.setState({
        loadingInitial: false
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.events &&
      this.props.events.length &&
      nextProps.events.length
    ) {
      if (this.state.loadedEvents.length === 0) {
        return this.setState({ loadedEvents: nextProps.events });
      }
      const haveFirstEvent = this.state.loadedEvents.find(
        obj => obj.id === nextProps.events[0].id
      );
      // console.log("haveFirstEvent", haveFirstEvent);

      if (!haveFirstEvent) {
        this.setState(prevState => {
          return {
            loadedEvents: [...prevState.loadedEvents, ...nextProps.events]
          };
        });
      }
    }
  }

  componentWillUnmount() {
    this.props.resetEvents();
  }

  getNextEvents = async () => {
    const { events } = this.props;

    const lastEvent = events && events[events.length - 1];

    const next = await this.props.getEventsForDashboard(lastEvent);

    if (next && next.docs && next.docs.length <= 1) {
      this.setState({
        moreEvents: false
      });
    }
  };

  handleContextRef = contextRef => this.setState({ contextRef });

  render() {
    const { loading, activities } = this.props;
    const { noEvents, loadedEvents, moreEvents } = this.state;

    if (this.state.loadingInitial) return <LoadingComponent inverted={true} />;

    return (
      <Grid>
        <Grid.Column width={10}>
          {noEvents && (
            <div>
              <h3>No Events Available</h3>
            </div>
          )}
          <div ref={this.handleContextRef}>
            <EventList
              loading={loading}
              events={loadedEvents}
              moreEvents={moreEvents}
              getNextEvents={this.getNextEvents}
            />
          </div>
        </Grid.Column>
        <Grid.Column width={6}>
          <EventActivity
            activities={activities}
            contextRef={this.state.contextRef}
          />
        </Grid.Column>
        <Grid.Column width={10}>
          <Loader active={loading} />
        </Grid.Column>
      </Grid>
    );
  }
}

const query = [
  {
    collection: "activity",
    orderBy: ["timestamp", "desc"],
    limit: 5
  }
];

const mapStateToProps = ({ async, events, firestore }) => ({
  loading: async.loading,
  events,
  activities: firestore.ordered.activity
});

export default connect(
  mapStateToProps,
  { getEventsForDashboard, resetEvents }
)(firestoreConnect(query)(EventDashboard));
