import React from "react";
import { withRouter } from "react-router-dom";
// Custom Components
import EventForm from "./EventForm";

const NewEvent = ({ history }) => {
  return (
    <div>
      <EventForm history={history} formName="newEvent" />
    </div>
  );
};

export default withRouter(NewEvent);
