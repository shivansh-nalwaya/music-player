import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  DrawerActions,
  NavigationContainer,
  DarkTheme
} from "@react-navigation/native";
import { Container } from "native-base";
import React, { Component } from "react";
import Header from "./src/components/header";
import PlayerComponent from "./src/components/player";
import { Home } from "./src/pages";

const Drawer = createDrawerNavigator();

class App extends Component {
  render() {
    const { Navigator, Screen } = Drawer;
    const navigationRef = React.createRef();
    return (
      <Container>
        <Header
          toggleDrawer={() =>
            navigationRef.current.dispatch(DrawerActions.toggleDrawer())
          }
        />
        <NavigationContainer theme={DarkTheme} ref={navigationRef}>
          <Navigator>
            <Screen name="Home" component={Home} />
          </Navigator>
        </NavigationContainer>
        <PlayerComponent />
      </Container>
    );
  }
}

export default App;
