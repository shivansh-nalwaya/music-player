import Slider from "@react-native-community/slider";
import LottieView from "lottie-react-native";
import { observer } from "mobx-react";
import { Text, View } from "native-base";
import React, { Component } from "react";
import { Image, Platform, TouchableOpacity } from "react-native";
import PlayerModel from "../../models/player-model";

const PlayPauseAnimation = require("../../resources/play-pause.json");
const RewindAnimation = require("../../resources/rewind-10-seconds.json");
const ForwardAnimation = require("../../resources/forward-10-seconds.json");
const DefaultCover = require("../../resources/ui_speaker.png");

class FullPlayer extends Component {
  play = () => {
    this.props.play();
    this.playPauseAnimation.play();
  };

  pause = () => {
    this.props.pause();
    this.playPauseAnimation.play();
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

  rewind10Seconds = () => {
    this.rewindAnimation.play();
    this.props.rewind10Seconds();
  };

  forward10Seconds = () => {
    this.forwardAnimation.play();
    this.props.forward10Seconds();
  };

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
            width: 300,
            height: 300,
            marginBottom: 15,
            alignSelf: "center"
          }}
        />
        <Text style={{ color: "white", alignSelf: "center", fontSize: 20 }}>
          {PlayerModel.currentSong.title || PlayerModel.currentSong.fileName}
        </Text>
        <Text note style={{ alignSelf: "center", fontSize: 18 }}>
          {PlayerModel.currentSong.album || "Unknown Album"}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            paddingHorizontal: "15%"
          }}
        >
          <TouchableOpacity onPress={this.rewind10Seconds}>
            <LottieView
              loop={false}
              ref={animation => (this.rewindAnimation = animation)}
              style={{ width: 60, height: 60 }}
              source={RewindAnimation}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={
              PlayerModel.playStatus == "PLAYING" ? this.pause : this.play
            }
          >
            <LottieView
              loop={false}
              speed={PlayerModel.playStatus == "PLAYING" ? 1 : -1}
              progress={PlayerModel.playStatus == "PLAYING" ? 1 : 0}
              ref={animation => (this.playPauseAnimation = animation)}
              style={{ width: 100, height: 100 }}
              source={PlayPauseAnimation}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.forward10Seconds}>
            <LottieView
              loop={false}
              ref={animation => (this.forwardAnimation = animation)}
              style={{ width: 60, height: 60 }}
              source={ForwardAnimation}
            />
          </TouchableOpacity>
        </View>
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
            onValueChange={this.props.onSliderEditing}
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
