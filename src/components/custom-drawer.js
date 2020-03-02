import {
  Body,
  Container,
  Content,
  Icon,
  Left,
  List,
  ListItem,
  Text
} from "native-base";
import React, { Component } from "react";
import { StyleSheet } from "react-native";

class CustomDrawer extends Component {
  render() {
    return (
      <Container>
        <Content style={styles.drawerContainer}>
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
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  drawerContainer: { backgroundColor: "black" },
  drawerText: { color: "white", fontSize: 18 }
});

export default CustomDrawer;
