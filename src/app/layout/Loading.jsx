import React from "react";
import { Dimmer, Loader } from "semantic-ui-react";

const LoadingComponent = ({ inverted }) => (
  <Dimmer inverted={inverted} active={true}>
    <Loader content="Loading..." />
  </Dimmer>
);

export default LoadingComponent;
