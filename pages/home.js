import React, { Component } from "react";
import { View, Text } from "native-base";
import MusicFiles from "react-native-get-music-files";
import { request, PERMISSIONS } from "react-native-permissions";

class Home extends Component {
  componentDidMount() {
    request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then(() => {
      console.log("Done ok");
      MusicFiles.getAll({})
        .then(tracks => {
          console.log(tracks);
        })
        .catch(error => {
          console.log(error);
        });
    });
  }
  render() {
    return (
      <View>
        <Text>Home</Text>
      </View>
    );
  }
}

export default Home;
