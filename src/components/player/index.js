import { observer } from "mobx-react";
import { View } from "native-base";
import React, { Component } from "react";
import { Dimensions } from "react-native";
import Sound from "react-native-sound";
import PlayerModel from "../../models/player-model";
import BottomDrawer from "../bottom-drawer";
import FullPlayer from "./full-player";
import MiniPlayer from "./mini-player";

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

  render() {
    if (!PlayerModel.currentSong) return <View />;
    return (
      <BottomDrawer
        ref={e => (this.drawer = e)}
        roundedEdges={this.state.drawerCollapsed}
        startUp={false}
        downDisplay={Dimensions.get("window").height - 100}
        backgroundColor="#292929"
        containerHeight={Dimensions.get("window").height}
        onExpanded={() => this.setState({ drawerCollapsed: false })}
        onCollapsed={() => this.setState({ drawerCollapsed: true })}
      >
        {this.state.drawerCollapsed && (
          <MiniPlayer
            play={this.play}
            pause={this.pause}
            onPress={() => {
              this.drawer.openDrawer();
              this.setState({ drawerCollapsed: false });
            }}
          />
        )}
        <FullPlayer
          play={this.play}
          pause={this.pause}
          onSliderEditing={this.onSliderEditing}
          onPress={() => {
            this.drawer.closeDrawer();
            this.setState({ drawerCollapsed: true });
          }}
        />
      </BottomDrawer>
    );
  }
}

export default observer(Player);
