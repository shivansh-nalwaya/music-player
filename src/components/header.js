import { Icon, Input, Text } from "native-base";
import React, { Component } from "react";
import { StatusBar, StyleSheet, View } from "react-native";

class Header extends Component {
  state = { searchOpen: false };

  render() {
    if (this.state.searchOpen)
      return (
        <View style={styles.inputContainer}>
          <Input
            placeholder="Search your music"
            placeholderTextColor="#d3d3d3"
            autoFocus={true}
            returnKeyType="search"
            onSubmitEditing={() => this.setState({ searchOpen: false })}
            style={{ color: "white", backgroundColor: "#656565" }}
          />
        </View>
      );
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
        <Icon
          name="search"
          type="FontAwesome5"
          style={styles.icon}
          onPress={() => this.setState({ searchOpen: true })}
        />
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
  inputContainer: {
    height: "8%",
    marginTop: 0
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
