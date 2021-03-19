import {checkIfTrackIsLoaded } from "../audio_deck.js"
import {getTracks
      , updateTracksPlayingState
      , playTrack }            from "../tracks.js"
import {createButton }         from "../../../../modules/helper.js"


export const playAndPauseButton = createButton (
  {attributes: {
    id: "playAndPause_btn"
  , className: "control_btn"
  , type: "image"
  , alt: "Play"
  , src: "src/images/151845-music-player-icons/svg/play-button.svg"
  , onclick : handlPlayAndPauseEvent}
  , text: ""}
  );


function handlPlayAndPauseEvent (event) {
  const audio = document.querySelector ("audio"),
        isPaused = audio.paused,
        trackIsLoaded = checkIfTrackIsLoaded (audio); // imported

  if (trackIsLoaded) {
    if (isPaused) {
      setPauseButton ()
      audio.play ()
    } else {
      setPlayButton ()
      audio.pause ()
    }
  } else {
    const tracks = getTracks (), // imported
          trackOne = tracks[0],
          path    = trackOne.path;
    updateTracksPlayingState (0) // imported
    playTrack (path, trackOne.cover); // imported
  }
}

export const setPlayButton = () => {
  const playSVG = "src/images/151845-music-player-icons/svg/play-button.svg";
  playAndPauseButton.src = playSVG;
}

export const setPauseButton = () => {
  const pauseSVG = "src/images/151845-music-player-icons/svg/pause.svg";
  playAndPauseButton.src = pauseSVG;
}


export default playAndPauseButton;