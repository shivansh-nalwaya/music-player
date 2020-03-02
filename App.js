import React, { Component } from "react";
import { Router, Stack, Scene } from "react-native-router-flux";
import { Home } from "./src/pages";
import PlayerComponent from "./src/components/player";
import { Container, Drawer } from "native-base";
import Header from "./src/components/header";
import CustomDrawer from "./src/components/custom-drawer";

class App extends Component {
  openDrawer = () => {
    this._drawer._root.open();
  };

  closeDrawer = () => {
    this._drawer._root.close();
  };

  render() {
    return (
      <Container>
        <Drawer
          ref={e => (this._drawer = e)}
          type="displace"
          content={<CustomDrawer closeDrawer={this.closeDrawer} />}
          tapToClose={true}
          captureGestures={true}
          tweenDuration={100}
          tweenHandler={ratio => ({
            main: { opacity: (2 - ratio) / 1.5 }
          })}
          panThreshold={0.08}
          onOpen={() => (this.drawerOpen = true)}
          onClose={() => (this.drawerOpen = false)}
          openDrawerOffset={100}
          panOpenMask={0.2}
          negotiatePan
          styles={{
            main: { backgroundColor: "black", borderRightWidth: 0 },
            drawer: {
              borderRightWidth: 0,
              shadowColor: "#ffffff",
              shadowOpacity: 0.8,
              shadowRadius: 3
            }
          }}
        >
          <Header openDrawer={this.openDrawer} closeDrawer={this.closeDrawer} />
          <Router>
            <Stack key="root" hideNavBar>
              <Scene key="home" component={Home} />
            </Stack>
          </Router>
          <PlayerComponent />
        </Drawer>
      </Container>
    );
  }
}

export default App;
