import Slider from "@react-native-community/slider";
import { observer } from "mobx-react";
import { Text, View } from "native-base";
import React, { Component } from "react";
import { Dimensions, Image, Platform, TouchableOpacity } from "react-native";
import Sound from "react-native-sound";
import PlayerModel from "../models/player-model";
import BottomDrawer from "./bottom-drawer";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import LottieView from "lottie-react-native";

const img_speaker = require("../resources/ui_speaker.png");
const img_pause = require("../resources/ui_pause.png");
const img_play = require("../resources/ui_play.png");
const img_playjumpleft = require("../resources/ui_playjumpleft.png");
const img_playjumpright = require("../resources/ui_playjumpright.png");

class Player extends Component {
  state = { drawerCollapsed: true };

  componentDidUpdate() {
    if (PlayerModel.playStatus == "STOPPED") {
      clearInterval(this.timer);
      this.timer = null;
      if (this.sound) {
        this.sound.release();
        this.sound = null;
      }
      this.play();
    } else if (
      this.sound &&
      PlayerModel.playStatus == "PLAYING" &&
      !this.timer
    ) {
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
      this.animation.play();
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
      PlayerModel.playStatus = "PAUSED";
      this.animation.play();
    }
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
    const coverImg = PlayerModel.currentSong.cover
      ? { uri: PlayerModel.currentSong.cover }
      : img_speaker;
    return (
      <BottomDrawer
        ref={e => (this.drawer = e)}
        roundedEdges={this.state.drawerCollapsed}
        startUp={false}
        downDisplay={Dimensions.get("window").height - 100}
        backgroundColor="#000000"
        containerHeight={Dimensions.get("window").height}
        onExpanded={() => this.setState({ drawerCollapsed: false })}
        onCollapsed={() => this.setState({ drawerCollapsed: true })}
      >
        {this.state.drawerCollapsed ? (
          <TouchableOpacity
            onPress={() => this.drawer.openDrawer()}
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
              onPress={
                PlayerModel.playStatus == "PAUSED" ? this.play : this.pause
              }
            >
              <AnimatedCircularProgress
                size={40}
                width={2}
                rotation={0}
                children={() => (
                  <Image
                    source={
                      PlayerModel.playStatus == "PAUSED" ? img_play : img_pause
                    }
                    style={{ width: 15, height: 15 }}
                  />
                )}
                fill={parseInt(
                  ((PlayerModel.currentTime * 1000) /
                    PlayerModel.currentSong.duration) *
                    100
                )}
                tintColor="#00e0ff"
                backgroundColor="#3d5875"
              ></AnimatedCircularProgress>
            </TouchableOpacity>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => this.drawer.closeDrawer()}>
            <Text>{PlayerModel.currentSong.title}</Text>
          </TouchableOpacity>
        )}
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
            onPress={
              PlayerModel.playStatus == "PLAYING" ? this.pause : this.play
            }
            style={{ alignItems: "center" }}
          >
            <LottieView
              loop={false}
              speed={PlayerModel.playStatus == "PLAYING" ? 1 : -1}
              progress={1}
              ref={animation => {
                this.animation = animation;
              }}
              style={{ width: 100, height: 100 }}
              source={require("../resources/animation.json")}
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
      </BottomDrawer>
    );
  }
}

export default observer(Player);
