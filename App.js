import React, { Component } from "react";
import { Provider } from "react-redux";
import store from "./src/reducers";
import Routes from "./src/routes";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Routes />
      </Provider>
    );
  }
}

export default App;
