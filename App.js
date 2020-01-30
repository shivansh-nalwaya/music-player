import React, { Component } from "react";
import { Router, Stack, Scene } from "react-native-router-flux";
import { Home } from "./pages";

class App extends Component {
  render() {
    return (
      <Router>
        <Stack key="root">
          <Scene key="home" component={Home} title="Home" />
        </Stack>
      </Router>
    );
  }
}

export default App;
