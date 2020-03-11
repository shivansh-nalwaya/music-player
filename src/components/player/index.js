import { observer } from "mobx-react";
import { View, Icon, Text } from "native-base";
import React, { Component } from "react";
import { StyleSheet, Dimensions, BackHandler } from "react-native";
import Sound from "react-native-sound";
import PlayerModel from "../../models/player-model";
import BottomDrawer from "../bottom-drawer";
import FullPlayer from "./full-player";
import MiniPlayer from "./mini-player";

class Player extends Component {
  state = { drawerCollapsed: true };

  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentDidMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  handleBackButtonClick() {
    if (!this.state.drawerCollapsed) {
      this.drawer.closeDrawer();
      this.setState({ drawerCollapsed: true });
    }
  }

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

  rewind10Seconds = () => {
    this.jumpSeconds(-10);
  };

  forward10Seconds = () => {
    this.jumpSeconds(10);
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
        {this.state.drawerCollapsed ? (
          <MiniPlayer
            play={this.play}
            pause={this.pause}
            onPress={() => {
              this.drawer.openDrawer();
              this.setState({ drawerCollapsed: false });
            }}
          />
        ) : (
          <View style={styles.container}>
            <Icon
              name="arrow-left"
              type="FontAwesome5"
              style={styles.icon}
              onPress={() => {
                this.drawer.closeDrawer();
                this.setState({ drawerCollapsed: true });
              }}
            />
            <Text style={styles.text}>Now Playing</Text>
            <Icon
              name="times"
              type="FontAwesome5"
              style={styles.icon}
              onPress={() => {
                this.drawer.closeDrawer();
                this.setState({ drawerCollapsed: true });
                PlayerModel.playStatus = "STOPPED";
                PlayerModel.currentSong = null;
                PlayerModel.currentTime = 0;
                this.pause();
              }}
            />
          </View>
        )}
        <FullPlayer
          play={this.play}
          pause={this.pause}
          onSliderEditing={this.onSliderEditing}
          rewind10Seconds={this.rewind10Seconds}
          forward10Seconds={this.forward10Seconds}
        />
      </BottomDrawer>
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

export default observer(Player);
