import React, { Component } from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { Icon, Text } from "native-base";

class Header extends Component {
  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#151515" />
        <Icon
          name="bars"
          type="FontAwesome5"
          style={styles.icon}
          onPress={this.props.openDrawer}
        />
        <Text style={styles.text}>Home</Text>
        <Icon name="search" type="FontAwesome5" style={styles.icon} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: "8%",
    paddingHorizontal: "6%",
    backgroundColor: "#151515",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  icon: {
    color: "orange",
    fontSize: 22
  },
  text: {
    fontSize: 20,
    textTransform: "uppercase",
    color: "orange"
  }
});

export default Header;
