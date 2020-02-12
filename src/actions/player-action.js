export const PLAY_SONG = "PLAY_SONG";
export const PAUSE_SONG = "PAUSE_SONG";
const Sound = require("react-native-sound");

export const playSong = song => {
  const player = new Sound(song.path, null, error => {
    if (error) {
      console.log("Error in playing");
      console.log(error);
    } else {
      player.play();
    }
  });
  return { type: PLAY_SONG, song: player };
};

export const pauseSong = () => {
  return { type: PAUSE_SONG };
};
