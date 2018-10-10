import { Component } from "react";
import { withRouter } from "react-router-dom";

class ScrollToTop extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.location.pathname) {
      if (this.props.location.pathname !== prevProps.location.pathname) {
        // console.log("props", this.props.location);
        // console.log("prevProps", prevProps.location);
        window.scrollTo(0, 0);
      }
    }
  }

  render() {
    return this.props.children;
  }
}

export default withRouter(ScrollToTop);
