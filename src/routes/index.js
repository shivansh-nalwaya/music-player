import React, { Component } from "react";
import { Router, Stack, Scene } from "react-native-router-flux";
import Home from "./home";

class Routes extends Component {
  render() {
    return (
      <Router>
        <Stack key="root" hideNavBar>
          <Scene key="home" component={Home} />
        </Stack>
      </Router>
    );
  }
}

export default Routes;
