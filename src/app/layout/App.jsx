import React, { Component } from "react";
import { Container } from "semantic-ui-react";
import { Route, Switch } from "react-router-dom";
import Loadable from "react-loadable";
// Components
import LoadingComponent from "./Loading";
// Nav
const AsyncNavBar = Loadable({
  loader: () => import("../../features/nav/NavBar/NavBar"),
  loading: LoadingComponent
});
// Modals
const AsyncModalManager = Loadable({
  loader: () => import("../../features/modals/ModalManager"),
  loading: LoadingComponent
});
// --------------- Pages ----------------
// Home
const AsyncHomePage = Loadable({
  loader: () => import("../../features/home/HomePage"),
  loading: LoadingComponent
});
//Events
const AsyncEventDashboard = Loadable({
  loader: () => import("../../features/events/EventDashboard/EventDashboard"),
  loading: LoadingComponent
});

const AsyncEventForm = Loadable({
  loader: () => import("../../features/events/EventForm/EventForm"),
  loading: LoadingComponent
});

class App extends Component {
  render() {
    return (
      <div>
        <AsyncModalManager />
        <Route exact path="/" component={AsyncHomePage} />
        <Route
          exact
          path="/(.+)"
          render={() => (
            <div>
              <AsyncNavBar />
              <Container className="main">
                <Switch>
                  <Route path="/events" component={AsyncEventDashboard} />
                  <Route path="/createEvent" component={AsyncEventForm} />
                </Switch>
              </Container>
            </div>
          )}
        />
      </div>
    );
  }
}

export default App;
