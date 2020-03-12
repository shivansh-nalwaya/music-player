import React from "react";
import { Router, Scene, Stack } from "react-native-router-flux";
import Home from "./home";

const Pages = () => {
  return (
    <Router>
      <Stack key="root" hideNavBar>
        <Scene key="home" component={Home} initial={true} />
      </Stack>
    </Router>
  );
};

export default Pages;
