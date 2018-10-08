import React, { Component } from "react";
import { Grid, Loader } from "semantic-ui-react";
import { connect } from "react-redux";
// Common Components
import LoadingComponent from "../../../app/layout/Loading";
// Actions
import { getEventsForDashboard } from "../eventActions";

class EventDashboard extends Component {
  state = {
    loadingInitial: true
  };

  async componentDidMount() {
    const next = await this.props.getEventsForDashboard();
  }

  render() {
    const { loading } = this.props;

    // if (this.state.loadingInitial) return <LoadingComponent inverted={true} />;

    return (
      <Grid>
        <Grid.Column width={10} />
        <Grid.Column width={6} />
        <Grid.Column width={10} />
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
