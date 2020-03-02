import {
  Body,
  Left,
  List,
  ListItem,
  Spinner,
  Text,
  Thumbnail,
  Right
} from "native-base";
import _ from "lodash";
import React, { Component } from "react";
import { PermissionsAndroid, ScrollView } from "react-native";
import MusicFiles from "react-native-get-music-files";
import PlayerModel from "../models/player-model";

class Home extends Component {
  state = { loading: true, tracks: [] };

  getAudioTimeString(seconds) {
    const h = parseInt(seconds / (60 * 60));
    const m = parseInt((seconds % (60 * 60)) / 60);
    const s = parseInt(seconds % 60);

    return [
      h == 0 ? null : h < 10 ? "0" + h : h,
      m < 10 ? "0" + m : m,
      s < 10 ? "0" + s : s
    ]
      .filter(Boolean)
      .join(":");
  }

  componentDidMount() {
    PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    ]).then(() => {
      MusicFiles.getAll({ cover: true })
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
      <ScrollView
        contentContainerStyle={{ backgroundColor: "#151515", height: "100%" }}
      >
        {this.state.loading && <Spinner color="orange" />}
        <List>
          {this.state.tracks.map((item, index) => (
            <ListItem
              thumbnail
              noBorder
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
                <Text style={{ color: "white" }}>
                  {_.truncate(item.title || item.fileName, 30)}
                </Text>
                <Text note>{_.truncate(item.album || "Unknown album")}</Text>
              </Body>
              <Right>
                <Text note>
                  {this.getAudioTimeString(item.duration / 1000)}
                </Text>
              </Right>
            </ListItem>
          ))}
        </List>
      </ScrollView>
    );
  }
}

export default Home;
