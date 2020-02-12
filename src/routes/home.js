import { Body, List, ListItem, Spinner, Text, View } from "native-base";
import React, { Component } from "react";
import { ScrollView, Dimensions } from "react-native";
import MusicFiles from "react-native-get-music-files";
import { PERMISSIONS, request } from "react-native-permissions";
import BottomDrawer from "rn-bottom-drawer";
import { Actions } from "react-native-router-flux";

class Home extends Component {
  state = { loading: true, tracks: [] };

  componentDidMount() {
    request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then(() => {
      MusicFiles.getAll({})
        .then(tracks => {
          this.setState({ tracks, loading: false });
        })
        .catch(error => {
          console.log(error);
        });
    });
  }

  render() {
    return (
      <View>
        <ScrollView>
          {this.state.loading && <Spinner color="black" />}
          <List>
            {this.state.tracks.map((item, index) => (
              <ListItem
                key={index}
                onPress={() => {
                  Actions.player({ filepath: item.path });
                }}
              >
                <Body>
                  <Text>{item.title || item.fileName}</Text>
                  <Text note>{item.album}</Text>
                </Body>
              </ListItem>
            ))}
          </List>
        </ScrollView>
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

export default Home;
