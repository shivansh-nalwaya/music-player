import _ from "lodash";
import {
  Body,
  Left,
  List,
  ListItem,
  Right,
  Spinner,
  Text,
  Thumbnail,
} from "native-base";
import React, { Component } from "react";
import { ScrollView } from "react-native";
import PlayerModel from "../models/player-model";
import ReadMusicData from "../utils/read-music-data";
import AudioTimeString from "../utils/audio-time-string";

class Home extends Component {
  state = { loading: true, tracks: [] };

  componentDidMount() {
    ReadMusicData((tracks) => {
      if (!Array.isArray(tracks)) tracks = [];
      this.setState({ tracks, loading: false });
    });
  }

  render() {
    return (
      <ScrollView
        contentContainerStyle={{
          backgroundColor: "#151515",
          minHeight: "100%",
        }}
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
                      "https://musicnotesbox.com/media/catalog/product/7/3/73993_image.png",
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
                <Text note>{AudioTimeString(item.duration / 1000)}</Text>
              </Right>
            </ListItem>
          ))}
        </List>
      </ScrollView>
    );
  }
}

export default Home;
