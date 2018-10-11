import React, { Component } from "react";
import { Container } from "semantic-ui-react";
import { Route, Switch } from "react-router-dom";
import Loadable from "react-loadable";
// Components
import LoadingComponent from "./Loading";
import { UserIsAuthenticated } from "../../features/auth/authWrapper";
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

// Events
const AsyncEventDashboard = Loadable({
  loader: () => import("../../features/events/EventDashboard/EventDashboard"),
  loading: LoadingComponent
});

const AsyncEventDetailsPage = Loadable({
  loader: () => import("../../features/events/EventDetails/EventDetailsPage"),
  loading: LoadingComponent
});

const AsyncNewEvent = Loadable({
  loader: () => import("../../features/events/EventForm/NewEvent"),
  loading: LoadingComponent
});

const AsyncEditEvent = Loadable({
  loader: () => import("../../features/events/EventForm/EditEvent"),
  loading: LoadingComponent
});

// User Profiles
const AsyncUserDetailsPage = Loadable({
  loader: () => import("../../features/user/UserDetails/UserDetailsPage"),
  loading: LoadingComponent
});

// Settings
const AsyncSettingsDashboard = Loadable({
  loader: () => import("../../features/user/Settings/SettingsDashboard"),
  loading: LoadingComponent
});

// People
const AsyncPeopleDashboard = Loadable({
  loader: () => import("../../features/user/PeopleDashboard/PeopleDashboard"),
  loading: LoadingComponent
});

// Not Found
const AsyncNotFound = Loadable({
  loader: () => import("../../app/layout/NotFound"),
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
                  <Route path="/event/:id" component={AsyncEventDetailsPage} />
                  <Route
                    path="/createEvent"
                    component={UserIsAuthenticated(AsyncNewEvent)}
                  />
                  <Route
                    path="/manage/:id"
                    component={UserIsAuthenticated(AsyncEditEvent)}
                  />
                  <Route
                    path="/profile/:id"
                    component={UserIsAuthenticated(AsyncUserDetailsPage)}
                  />
                  <Route
                    path="/settings"
                    component={UserIsAuthenticated(AsyncSettingsDashboard)}
                  />
                  <Route
                    path="/people"
                    component={UserIsAuthenticated(AsyncPeopleDashboard)}
                  />
                  <Route path="/error" component={AsyncNotFound} />
                  <Route component={AsyncNotFound} />
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
