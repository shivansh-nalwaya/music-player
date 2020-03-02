import { List, ListItem, Text, View } from "native-base";
import React, { Component } from "react";
import { StyleSheet, Dimensions } from "react-native";

class CustomDrawer extends Component {
  render() {
    return (
      <View style={styles.drawerContainer}>
        <List>
          <ListItem onPress={this.props.closeDrawer}>
            <Text style={styles.drawerText}>Products</Text>
          </ListItem>
          <ListItem onPress={this.props.closeDrawer}>
            <Text style={styles.drawerText}>Orders</Text>
          </ListItem>
          <ListItem>
            <Text style={styles.drawerText}>Reports</Text>
          </ListItem>
        </List>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  drawerContainer: {
    backgroundColor: "black",
    minHeight: Dimensions.get("window").height
  },
  drawerText: { color: "white", fontSize: 18 }
});

export default CustomDrawer;
