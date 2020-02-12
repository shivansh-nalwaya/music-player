import { Text, View } from "native-base";
import React, { Component } from "react";
import { Dimensions } from "react-native";
import BottomDrawer from "rn-bottom-drawer";

class Player extends Component {
  render() {
    return (
      <BottomDrawer
        roundedEdges={false}
        startUp={false}
        downDisplay={Dimensions.get("window").height - 100}
        backgroundColor="lightpink"
        containerHeight={Dimensions.get("window").height}
      >
        <View style={{ padding: 10 }}>
          <Text>Currently playing</Text>
        </View>
      </BottomDrawer>
    );
  }
}

export default Player;
