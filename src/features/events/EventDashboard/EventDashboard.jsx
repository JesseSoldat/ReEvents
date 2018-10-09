import React, { Component } from "react";
import { Grid, Loader } from "semantic-ui-react";
import { connect } from "react-redux";
// Common Components
import LoadingComponent from "../../../app/layout/Loading";
// Custom Components
import EventList from "../EventList/EventList";
// Actions
import { getEventsForDashboard } from "../eventActions";

class EventDashboard extends Component {
  state = {
    loadingInitial: true,
    loadedEvents: [],
    moreEvents: false,
    noEvents: true
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

  render() {
    const { loading } = this.props;
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
          <div>
            <EventList
              loading={loading}
              events={loadedEvents}
              moreEvents={moreEvents}
              getNextEvents={this.getNextEvents}
            />
          </div>
        </Grid.Column>
        <Grid.Column width={6} />
        <Grid.Column width={10}>
          <Loader active={loading} />
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = ({ async, events }) => ({
  loading: async.loading,
  events
});

export default connect(
  mapStateToProps,
  { getEventsForDashboard }
)(EventDashboard);
