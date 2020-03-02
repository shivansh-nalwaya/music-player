import { List, ListItem, Text, View } from "native-base";
import React, { Component } from "react";
import { StyleSheet, Dimensions } from "react-native";

class CustomDrawer extends Component {
  render() {
    return (
      <View style={styles.drawerContainer}>
        <List>
          <ListItem last onPress={this.props.closeDrawer}>
            <Text style={styles.drawerText}>Home</Text>
          </ListItem>
          <ListItem last onPress={this.props.closeDrawer}>
            <Text style={styles.drawerText}>Tracks</Text>
          </ListItem>
          <ListItem last>
            <Text style={styles.drawerText}>Albums</Text>
          </ListItem>
          <ListItem last>
            <Text style={styles.drawerText}>Artists</Text>
          </ListItem>
          <ListItem last>
            <Text style={styles.drawerText}>Playlists</Text>
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
  drawerText: { color: "white", fontSize: 19 }
});

export default CustomDrawer;
