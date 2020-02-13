import Slider from "@react-native-community/slider";
import { observer } from "mobx-react";
import { Text, View } from "native-base";
import React, { Component } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  TouchableOpacity
} from "react-native";
import Sound from "react-native-sound";
import BottomDrawer from "rn-bottom-drawer";
import PlayerModel from "../models/player-model";

const img_speaker = require("../resources/ui_speaker.png");
const img_pause = require("../resources/ui_pause.png");
const img_play = require("../resources/ui_play.png");
const img_playjumpleft = require("../resources/ui_playjumpleft.png");
const img_playjumpright = require("../resources/ui_playjumpright.png");

class Player extends Component {
  componentDidUpdate() {
    if (PlayerModel.playStatus == "STOPPED") {
      clearInterval(this.timer);
      this.timer = null;
      if (this.sound) {
        this.sound.release();
        this.sound = null;
      }
      this.play();
    } else if (PlayerModel.playStatus == "PLAYING" && !this.timer) {
      this.timer = setInterval(() => {
        this.sound.getCurrentTime((secs, isPlaying) => {
          if (isPlaying) PlayerModel.updateTimer(secs);
        });
      }, 500);
    }
  }

  onSliderEditStart = () => {
    this.sliderEditing = true;
  };

  onSliderEditEnd = () => {
    this.sliderEditing = false;
  };

  onSliderEditing = value => {
    if (this.sound) {
      this.sound.setCurrentTime(value);
      PlayerModel.updateTimer(value);
    }
  };

  play = async () => {
    if (PlayerModel.playStatus == "PAUSED") {
      PlayerModel.playStatus = "PLAYING";
      this.sound.play(this.playComplete);
      return;
    }
    if (PlayerModel.currentSong) {
      const filepath = PlayerModel.currentSong.path;

      this.sound = new Sound(filepath, "", error => {
        if (error) {
          console.log("failed to load the sound", error);
          PlayerModel.playStatus = "PAUSED";
        } else {
          PlayerModel.playStatus = "PLAYING";
          PlayerModel.updateTimer(0);
          this.sound.play(this.playComplete);
        }
      });
    }
  };

  playComplete = success => {
    if (this.sound) {
      if (success) {
        console.log("successfully finished playing");
      } else {
        console.log("playback failed due to audio decoding errors");
      }
      PlayerModel.playStatus = "STOPPED";
      PlayerModel.updateTimer(0);
      this.sound.setCurrentTime(0);
    }
  };

  pause = () => {
    if (this.sound) {
      this.sound.pause();
    }
    PlayerModel.playStatus = "PAUSED";
  };

  jumpPrev15Seconds = () => {
    this.jumpSeconds(-15);
  };

  jumpNext15Seconds = () => {
    this.jumpSeconds(15);
  };

  jumpSeconds = secsDelta => {
    if (this.sound) {
      this.sound.getCurrentTime((secs, isPlaying) => {
        let nextSecs = secs + secsDelta;
        if (nextSecs < 0) nextSecs = 0;
        else if (nextSecs > PlayerModel.currentSong.duration)
          nextSecs = PlayerModel.currentSong.duration;
        this.sound.setCurrentTime(nextSecs);
        PlayerModel.updateTimer(nextSecs);
      });
    }
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
    if (!PlayerModel.currentSong) return <View />;
    const currentTimeString = this.getAudioTimeString(PlayerModel.currentTime);
    const durationString = this.getAudioTimeString(
      parseInt(PlayerModel.currentSong.duration / 1000)
    );
    return (
      <BottomDrawer
        roundedEdges={false}
        startUp={false}
        downDisplay={Dimensions.get("window").height - 100}
        backgroundColor="lightpink"
        containerHeight={Dimensions.get("window").height}
      >
        <View style={{ padding: 10 }}>
          <Text>{PlayerModel.currentSong.title}</Text>
        </View>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Image
            source={img_speaker}
            style={{
              width: 150,
              height: 150,
              marginBottom: 15,
              alignSelf: "center"
            }}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginVertical: 15
            }}
          >
            <TouchableOpacity
              onPress={this.jumpPrev15Seconds}
              style={{ justifyContent: "center" }}
            >
              <Image
                source={img_playjumpleft}
                style={{ width: 30, height: 30 }}
              />
              <Text
                style={{
                  position: "absolute",
                  alignSelf: "center",
                  marginTop: 1,
                  color: "white",
                  fontSize: 12
                }}
              >
                15
              </Text>
            </TouchableOpacity>
            {PlayerModel.playStatus == "PLAYING" && (
              <TouchableOpacity
                onPress={this.pause}
                style={{ marginHorizontal: 20 }}
              >
                <Image source={img_pause} style={{ width: 30, height: 30 }} />
              </TouchableOpacity>
            )}
            {PlayerModel.playStatus == "PAUSED" && (
              <TouchableOpacity
                onPress={this.play}
                style={{ marginHorizontal: 20 }}
              >
                <Image source={img_play} style={{ width: 30, height: 30 }} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={this.jumpNext15Seconds}
              style={{ justifyContent: "center" }}
            >
              <Image
                source={img_playjumpright}
                style={{ width: 30, height: 30 }}
              />
              <Text
                style={{
                  position: "absolute",
                  alignSelf: "center",
                  marginTop: 1,
                  color: "white",
                  fontSize: 12
                }}
              >
                15
              </Text>
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
      </BottomDrawer>
    );
  }
}

export default observer(Player);
