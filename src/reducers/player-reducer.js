import { PLAY_SONG, PAUSE_SONG } from "../actions/player-action";

const initialState = { song: null, isPlaying: false };

const player = (state = initialState, action) => {
  switch (action.type) {
    case PLAY_SONG: {
      return { ...state, song: action.song, isPlaying: true };
    }
    case PAUSE_SONG: {
      return { ...state, isPlaying: false };
    }
    default:
      return state;
  }
};

export default player;
