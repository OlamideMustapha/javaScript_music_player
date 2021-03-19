import {createHTMLElement }   from "../../../modules/helper.js"
import {updateProgessBar
      , setProgessBarValues } from "./controls/progress_bar.js"
import {setPauseButton
      , setPlayButton }       from "./controls/playAndPause.js"
import {getTracks
      , getCurrentPlayingtrack
      , playTrack }           from "./tracks.js"
import {getLoopTrackState
      , getShuffleState }     from "../music_widget.js"
import {shuffleTracks }       from "./controls/shuffle.js"
import {playNext }            from "./controls_component.js"



function endTrack (_) {
  const loopTracks = getLoopTrackState ();
  const shuffle = getShuffleState ();
  if (loopTracks === "all") // imported
    if (shuffle) {// imported
      shuffleTracks () // imported
    } else
      playNext ()  // imported
  else if (loopTracks === "one") { // impoted
    const currentTrack = getCurrentPlayingtrack (getTracks()) // imported
    playTrack (currentTrack.path, currentTrack.cover) // imported
  } else
    setPlayButton () // imported
}

export const audioDeck = createHTMLElement (
  "audio"
  , { controls: "controls"
    , autoplay: "autoplay"
    , className: "audioDeck"
    , style: "display: none"
    , ontimeupdate: updateProgessBar
    , onplay: setProgessBarValues
    , onended: endTrack}
)

export const checkIfTrackIsLoaded = _ => audioDeck.src ? true : false;

export function setAudioSourceURL (url) {
  audioDeck.src = url;
  setPauseButton () // imported
}

export default audioDeck
