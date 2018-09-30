import React, { Component } from "react";
import { Grid, Loader } from "semantic-ui-react";
import { connect } from "react-redux";

class EventDashboard extends Component {
  render() {
    return <div />;
  }
}

const mapStateToProps = ({ events }) => ({
  events
});

export default connect(mapStateToProps)(EventDashboard);
