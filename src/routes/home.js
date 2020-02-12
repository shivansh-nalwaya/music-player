import React, { Component } from "react";
import { Text, List, ListItem, Body, Spinner } from "native-base";
import { ScrollView } from "react-native";
import MusicFiles from "react-native-get-music-files";
import { request, PERMISSIONS } from "react-native-permissions";
import { playSong } from "../actions/player-action";
import { connect } from "react-redux";

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
              onPress={() => setTimeout(() => this.props.playSong(item), 100)}
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

const mapStateToProps = state => {
  return { isPlaying: state.player.isPlaying };
};

const mapDispatchToProps = {
  playSong
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
