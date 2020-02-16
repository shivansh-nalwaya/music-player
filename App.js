import React, { Component } from "react";
import { Router, Stack, Scene } from "react-native-router-flux";
import { Home } from "./src/pages";
import PlayerComponent from "./src/components/player-component";
import { Container } from "native-base";

class App extends Component {
  render() {
    return (
      <Container>
        <Router>
          <Stack key="root" hideNavBar>
            <Scene key="home" component={Home} />
          </Stack>
        </Router>
        <PlayerComponent />
      </Container>
    );
  }
}

export default App;
