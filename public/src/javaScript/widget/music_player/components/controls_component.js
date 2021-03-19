import {createHTMLElement
      , createButton }       from "../../../modules/helper.js"
import {playAndPauseButton } from "./controls/playAndPause.js"
import {progressBarWrapper } from "./controls/progress_bar.js"
import {getTracks
      , getNextTrack
      , getPreviousTrack
      , playTrack }          from "./tracks.js"
import {shuffle }            from "./controls/shuffle.js"
import {toggleLoop}          from "../music_widget.js"
import {setCoverImage}       from "./cover_dispaly.js"


export function playNext () {
  const tracks    = getTracks (), // imported
        nextTrack = getNextTrack (tracks), // imported
        path      = nextTrack.path;
  playTrack (path, nextTrack.cover); // imported
}

function playPrevious () {
  const tracks        = getTracks (),
        previousTrack = getPreviousTrack (tracks),
        path          = previousTrack.path;
  playTrack (path, previousTrack.cover);
}

const nextButton = createButton (
  {attributes: {
    id: "next_btn"
  , className: "control_btn"
  , type: "image"
  , alt: "next"
  , src: "src/images/151845-music-player-icons/svg/next.svg"
  , onclick: playNext }
  , text: ""}
  );

const previousButton = createButton (
  {attributes: {
    id: "previous_btn"
  , className: "control_btn"
  , type: "image"
  , alt: "previous"
  , src: "src/images/151845-music-player-icons/svg/previous.svg"
  , onclick: playPrevious }
  , text: ""}
  );

function setRepeatOnceButton () {
  const button = document.querySelector ("#repeat_btn");
  button.src   = "src/images/repeat_1.svg"
}

function setRepeatAllButton () {
  const button = document.querySelector ("#repeat_btn");
  button.src   = "src/images/repeat.svg"
}

export function setRepeatButtonSelectState (loopTracks) {
  const repeatButton = document.querySelector ("#repeat_btn");
  loopTracks === "none"
    ? repeatButton.classList.remove ("selected")
    : repeatButton.classList.add ("selected");
}

export function setRepeatSVGButton (loopTracks) {
  loopTracks === "one" 
    ? setRepeatOnceButton ()
    : setRepeatAllButton ();
}


const repeatButton = createButton (
  {attributes: {
    id: "repeat_btn"
  , className: "control_btn"
  , type: "image"
  , alt: "repeat"
  , src: "src/images/repeat.svg"
  , onclick: () => toggleLoop ()} // imported
  , text: ""}
  );

const playlist = createButton (
  {attributes: {
    id: "playlist_btn"
  , className: "control_btn"
  , type: "image"
  , alt: "playlist"
  , src: "src/images/151845-music-player-icons/svg/list.svg" }
  , text: ""}
  );

function handleVolumeChangeEvent (event) {
  let audio = document.querySelector("audio"),
      value = Number (event.target.value);
  audio.volume = value;
}

const volume = createHTMLElement (
    "input"
  , { type:"range"
    , id:"volume"
    , className: "volume"
    , min:"0"
    , max:"1"
    , value:"0.5"
    , step:"0.1"
    , onchange: handleVolumeChangeEvent}
);

const createControlsWrapper = () => {
  const wrapper = createHTMLElement (
    "div"
  , {className:"controls-wrapper"}
  , previousButton
  , playAndPauseButton
  , nextButton
  , repeatButton
  , shuffle // imported
  , volume)
  return wrapper
}

export function createControls () {
  const wrapper = createControlsWrapper ();
  return createHTMLElement (
      "div"
    , {className: "controls"}
    , progressBarWrapper // imported
    , wrapper
  )
}

export default createControls
