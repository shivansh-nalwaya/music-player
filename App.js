import React, { Component } from "react";
import { Router, Stack, Scene } from "react-native-router-flux";
import { Home, Player } from "./src/pages";

class App extends Component {
  render() {
    return (
      <Router>
        <Stack key="root" hideNavBar>
          <Scene key="home" component={Home} />
          <Scene key="player" component={Player} />
        </Stack>
      </Router>
    );
  }
}

export default App;
