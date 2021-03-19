import {createHTMLElement }  from "../../modules/helper.js"
import {createControls
      , setRepeatButtonSelectState
      , setRepeatSVGButton } from "./components/controls_component.js"
import {tracksWrapper }      from "./components/tracks.js"
import {audioDeck }          from "./components/audio_deck.js"
import {headerWrapper}       from "./components/header_component.js"
import {coverDisplay
       ,setCoverImage}        from "./components/cover_dispaly.js"


let loopTracks = "none",
    shuffle = false;


export const toggleLoop = () => {
  loopTracks = loopTracks === "none"
                ? "all"
                : loopTracks === "all"
                  ? "one"
                  : "none";
  setRepeatButtonSelectState (loopTracks);
  setRepeatSVGButton (loopTracks);
}


function setToggleButtonSelectState (shuffle) {
  const shuffleButton = document.querySelector ("#shuffle_btn")
  shuffle
    ? shuffleButton.classList.add ("selected")
    : shuffleButton.classList.remove ("selected");
}

export const toggleShuffle = () => {
  shuffle = !shuffle;
  setToggleButtonSelectState (shuffle);
}


export const getLoopTrackState = () => loopTracks;
export const getShuffleState   = () => shuffle;


const controls = createControls ();

export const sideBar = createHTMLElement (
    "div"
  , {className: "side_bar"}
  , headerWrapper
  , coverDisplay
  // , controls
);

const createMusicPlayer = () => {
  const controls = createControls ();
  const player = createHTMLElement (
          "div"
        , { id: "music_player"
          , className: "hide"}  // toggle display
        , tracksWrapper  // imported
        , controls
        , audioDeck); // imported
  return player;
};
 
export const musicPlayer = () => {
  const player      = createMusicPlayer ();
  const musicWidget = createHTMLElement (
    "div"
  , {className: "music_widget"}
  , sideBar
  , player
  );
  return musicWidget
}

export default musicPlayer

