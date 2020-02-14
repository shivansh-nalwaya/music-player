import {
  Body,
  List,
  ListItem,
  Spinner,
  Text,
  View,
  Left,
  Thumbnail
} from "native-base";
import React, { Component } from "react";
import { ScrollView, PermissionsAndroid } from "react-native";
import MusicFiles from "react-native-get-music-files";
import { PERMISSIONS, request } from "react-native-permissions";
import PlayerModel from "../models/player-model";

class Home extends Component {
  state = { loading: true, tracks: [] };

  componentDidMount() {
    PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    ]).then(() => {
      MusicFiles.getAll({ cover: true, blurred: true })
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
              thumbnail
              key={index}
              onPress={() => {
                PlayerModel.setSong(item);
              }}
            >
              <Left>
                <Thumbnail
                  source={{
                    uri:
                      item.cover ||
                      "https://musicnotesbox.com/media/catalog/product/7/3/73993_image.png"
                  }}
                />
              </Left>
              <Body>
                <Text>{item.title || item.fileName}</Text>
                <Text note>{item.album || "Unknown album"}</Text>
              </Body>
            </ListItem>
          ))}
        </List>
      </ScrollView>
    );
  }
}

export default Home;
