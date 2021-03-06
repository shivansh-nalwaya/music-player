import { action, decorate, observable } from "mobx";

class PlayerClass {
  currentSong = null;
  playStatus = "STOPPED";
  currentTime = 0;

  setSong(song) {
    this.currentSong = song;
    this.playStatus = "STOPPED";
  }

  play() {
    this.playStatus = "PLAYING";
  }

  pause() {
    this.playStatus = "PAUSED";
  }

  updateTimer(time) {
    this.currentTime = time;
  }
}

decorate(PlayerClass, {
  currentSong: observable,
  playStatus: observable,
  currentTime: observable,
  setSong: action,
  play: action,
  pause: action,
  updateTimer: action
});

const Player = new PlayerClass();
export default Player;
