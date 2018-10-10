import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withFirestore } from "react-redux-firebase";
// Custom Components
import EventForm from "./EventForm";

class EditEvent extends Component {
  async componentDidMount() {
    const { firestore, match } = this.props;
    await firestore.setListener(`events/${match.params.id}`);
  }

  async componentWillUnmount() {
    const { firestore, match } = this.props;
    await firestore.unsetListener(`events/${match.params.id}`);
  }

  render() {
    return (
      <div>
        <EventForm history={this.props.history} formName="editEvent" />
      </div>
    );
  }
}

export default withFirestore(withRouter(EditEvent));
