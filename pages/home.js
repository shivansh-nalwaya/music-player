import React, { Component } from "react";
import { Text, List, ListItem, Body, Spinner } from "native-base";
import { ScrollView } from "react-native";
import MusicFiles from "react-native-get-music-files";
import { request, PERMISSIONS } from "react-native-permissions";
const Sound = require("react-native-sound");
class Home extends Component {
  state = { loading: true, tracks: [] };

  componentDidMount() {
    request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then(() => {
      MusicFiles.getAll({})
        .then(tracks => {
          console.log(tracks);
          this.setState({ tracks, loading: false });
        })
        .catch(error => {
          console.log(error);
        });
    });
  }

  render() {
    return (
      <ScrollView>
        {this.state.loading && <Spinner color="black" />}
        <List>
          {this.state.tracks.map((item, index) => (
            <ListItem
              key={index}
              onPress={() => {
                setTimeout(() => {
                  this.hello = new Sound(item.path, null, error => {
                    if (error) {
                      console.log(error);
                    }
                  });
                });
                setTimeout(() => {
                  this.hello.play(success => {
                    if (!success) {
                      console.log("Sound did not play!");
                    }
                  });
                }, 100);
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
    );
  }
}

export default Home;
