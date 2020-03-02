import Slider from "@react-native-community/slider";
import LottieView from "lottie-react-native";
import { observer } from "mobx-react";
import { Text, View, Icon } from "native-base";
import React, { Component } from "react";
import { Image, Platform, TouchableOpacity, StyleSheet } from "react-native";
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
        <View style={styles.container}>
          <Icon
            name="arrow-left"
            type="FontAwesome5"
            style={styles.icon}
            onPress={this.props.onPress}
          />
          <Text style={styles.text}>Now Playing</Text>
          <Icon
            name="times"
            type="FontAwesome5"
            style={styles.icon}
            onPress={() => {
              this.props.onPress();
              PlayerModel.playStatus = "STOPPED";
              PlayerModel.currentSong = null;
              PlayerModel.currentTime = 0;
              this.props.pause();
            }}
          />
        </View>
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

const styles = StyleSheet.create({
  container: {
    height: "8%",
    paddingHorizontal: "6%",
    backgroundColor: "#292929",
    display: "flex",
    position: "absolute",
    top: 0,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center"
  },
  icon: {
    color: "orange"
  },
  text: {
    fontSize: 20,
    textTransform: "uppercase",
    color: "orange"
  }
});

export default observer(FullPlayer);
