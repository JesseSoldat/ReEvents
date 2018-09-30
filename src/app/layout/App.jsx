import React, { Component } from "react";
import { Container } from "semantic-ui-react";
import { Route, Switch } from "react-router-dom";
import Loadable from "react-loadable";
// Components
import LoadingComponent from "./Loading";
// Pages
// const AsyncHomePage = Loadable({
//   loader: () => import("../../features/home/HomePage"),
//   loading: LoadingComponent
// });
import Home from "../../features/home/HomePage";

class App extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" component={Home} />
        </Switch>
      </div>
    );
  }
}

export default App;
