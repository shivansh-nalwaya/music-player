import Slider from "@react-native-community/slider";
import LottieView from "lottie-react-native";
import { observer } from "mobx-react";
import { Text, View } from "native-base";
import React, { Component } from "react";
import { Image, Platform, TouchableOpacity } from "react-native";
import PlayerModel from "../../models/player-model";

const AnimationData = require("../../resources/animation.json");
const DefaultCover = require("../../resources/ui_speaker.png");

class FullPlayer extends Component {
  play = () => {
    this.props.play();
    this.animation.play();
  };

  pause = () => {
    this.props.pause();
    this.animation.play();
  };

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

  render() {
    const currentTimeString = this.getAudioTimeString(PlayerModel.currentTime);
    const durationString = this.getAudioTimeString(
      parseInt(PlayerModel.currentSong.duration / 1000)
    );
    const coverImg = PlayerModel.currentSong.cover
      ? { uri: PlayerModel.currentSong.cover }
      : DefaultCover;
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Image
          source={coverImg}
          style={{
            width: 150,
            height: 150,
            marginBottom: 15,
            alignSelf: "center"
          }}
        />
        <TouchableOpacity
          onPress={PlayerModel.playStatus == "PLAYING" ? this.pause : this.play}
          style={{ alignItems: "center" }}
        >
          <LottieView
            loop={false}
            speed={PlayerModel.playStatus == "PLAYING" ? 1 : -1}
            progress={PlayerModel.playStatus == "PLAYING" ? 1 : 0}
            ref={animation => {
              this.animation = animation;
            }}
            style={{ width: 100, height: 100 }}
            source={AnimationData}
          />
        </TouchableOpacity>
        <View
          style={{
            marginVertical: 15,
            marginHorizontal: 15,
            flexDirection: "row"
          }}
        >
          <Text style={{ color: "white", alignSelf: "center" }}>
            {currentTimeString}
          </Text>
          <Slider
            onTouchStart={this.onSliderEditStart}
            onTouchEnd={this.onSliderEditEnd}
            onValueChange={this.onSliderEditing}
            value={PlayerModel.currentTime}
            maximumValue={parseInt(PlayerModel.currentSong.duration / 1000)}
            maximumTrackTintColor="gray"
            minimumTrackTintColor="white"
            thumbTintColor="white"
            style={{
              flex: 1,
              alignSelf: "center",
              marginHorizontal: Platform.select({ ios: 5 })
            }}
          />
          <Text style={{ color: "white", alignSelf: "center" }}>
            {durationString}
          </Text>
        </View>
      </View>
    );
  }
}

export default observer(FullPlayer);
