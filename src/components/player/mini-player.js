import LottieView from "lottie-react-native";
import { observer } from "mobx-react";
import { Text, View } from "native-base";
import React, { Component } from "react";
import { TouchableOpacity } from "react-native";
import PlayerModel from "../../models/player-model";

const AnimationData = require("../../resources/animation.json");

class MiniPlayer extends Component {
  play = () => {
    this.props.play();
    this.animation.play();
  };

  pause = () => {
    this.props.pause();
    this.animation.play();
  };

  render() {
    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        style={{
          padding: 18,
          flexDirection: "row",
          justifyContent: "space-between"
        }}
      >
        <View>
          <Text note>Now Playing</Text>
          <Text style={{ color: "white" }}>
            {PlayerModel.currentSong.title}
          </Text>
        </View>
        <TouchableOpacity
          onPress={PlayerModel.playStatus == "PAUSED" ? this.play : this.pause}
        >
          <LottieView
            loop={false}
            speed={PlayerModel.playStatus == "PLAYING" ? 1 : -1}
            progress={PlayerModel.playStatus == "PLAYING" ? 1 : 0}
            ref={animation => {
              this.animation = animation;
            }}
            style={{ width: 68, height: 68, marginTop: "-10%" }}
            source={AnimationData}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }
}

export default observer(MiniPlayer);
