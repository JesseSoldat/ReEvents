import "semantic-ui-css/semantic.min.css";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import "./index.css";
import App from "./app/layout/App";
import { configureStore } from "./app/store/configureStore";
import registerServiceWorker from "./registerServiceWorker";

const store = configureStore();

const rootEl = document.getElementById("root");

const render = () => {
  console.log("test");

  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>,
    rootEl
  );
};

if (module.hot) {
  module.hot.accept("./app/layout/App", () => {
    setTimeout(render);
  });
}

render();

registerServiceWorker();
