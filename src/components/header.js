import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { Icon, Text } from "native-base";

class Header extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Icon name="home" type="FontAwesome5" style={styles.icon} />
        <Text style={styles.text}>Home</Text>
        <Icon name="search" type="FontAwesome5" style={styles.icon} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: "8%",
    paddingHorizontal: "8%",
    backgroundColor: "black",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  icon: {
    color: "orange"
  },
  text: {
    fontSize: 20,
    textTransform: "uppercase",
    color: "orange"
  }
});

export default Header;
