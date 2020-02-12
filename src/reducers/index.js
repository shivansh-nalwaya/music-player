import { combineReducers, createStore } from "redux";
import player from "./player-reducer";

const rootReducer = combineReducers({ player });

export default createStore(rootReducer);
