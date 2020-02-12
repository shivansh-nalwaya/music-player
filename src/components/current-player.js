import { Text, View } from "native-base";
import React, { Component } from "react";
import { Dimensions } from "react-native";
import BottomDrawer from "rn-bottom-drawer";

class CurrentPlayer extends Component {
  render() {
    return (
      <View>
        <BottomDrawer
          roundedEdges={false}
          startUp={false}
          downDisplay={Dimensions.get("window").height - 100}
          backgroundColor="#3e3e3e"
          containerHeight={Dimensions.get("window").height}
        >
          <View>
            <Text style={{ color: "white" }}>
              Get directions to your location
            </Text>
          </View>
        </BottomDrawer>
      </View>
    );
  }
}

export default CurrentPlayer;
