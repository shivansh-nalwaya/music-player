import { Body, List, ListItem, Spinner, Text, View } from "native-base";
import React, { Component } from "react";
import { ScrollView } from "react-native";
import MusicFiles from "react-native-get-music-files";
import { PERMISSIONS, request } from "react-native-permissions";
import PlayerModel from "../models/player-model";

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
      <ScrollView>
        {this.state.loading && <Spinner color="black" />}
        <List>
          {this.state.tracks.map((item, index) => (
            <ListItem
              key={index}
              onPress={() => {
                PlayerModel.setSong(item);
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
