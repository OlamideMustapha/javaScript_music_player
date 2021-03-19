import  { createHTMLElement
        , createButton } from "../helper.js"



function handlPlayAndPause (event) {
  const audio = document.querySelector("audio");
  const isPaused = audio.paused;
  if (isPaused) {
    event.target.src = "src/images/151845-music-player-icons/svg/pause.svg"
    audio.play ()
  } else {
    event.target.src = "src/images/151845-music-player-icons/svg/play-button.svg"
    audio.pause ()
  }
}


const playAndPauseButton = createButton (
  {attributes: {
    id: "playAndPause_btn"
  , className: "control_btn"
  , type: "image"
  , alt: "Play"
  , src: "src/images/151845-music-player-icons/svg/play-button.svg"
  , onclick : handlPlayAndPause}
  , text: ""}
  );


const nextButton = createButton (
  {attributes: {
    id: "next_btn"
  , className: "control_btn"
  , type: "image"
  , alt: "next"
  , src: "src/images/151845-music-player-icons/svg/next.svg" }
  , text: ""}
  );

const previousButton = createButton (
  {attributes: {
    id: "previous_btn"
  , className: "control_btn"
  , type: "image"
  , alt: "previous"
  , src: "src/images/151845-music-player-icons/svg/previous.svg" }
  , text: ""}
  );

const repeatButton = createButton (
  {attributes: {
    id: "repeat_btn"
  , className: "control_btn"
  , type: "image"
  , alt: "repeat"
  , src: "src/images/repeat.svg" }
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

const shuffle = createButton (
  {attributes: {
    id: "shuffle_btn"
  , className: "control_btn"
  , type: "image"
  , alt: "playlist"
  , src: "src/images/shuffle.svg" }
  , text: ""}
  );

function handleVolumeChange (event) {
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
    , onchange: handleVolumeChange}
);

const progressBar = createHTMLElement (
  "input"
, { type:"range"
  , id:"progress_bar"
  , className: "progress_bar"
  , min:"0"
  , max:"100"
  , value:"0"
  , step:"10"}
);


const createControlsWrapper = () => {
  const wrapper = createHTMLElement (
    "div"
  , {className:"controls-wrapper"}
  , previousButton
  , playAndPauseButton
  , nextButton
  , repeatButton
  , shuffle
  , volume)
  return wrapper
}

export function createControls () {
  const wrapper = createControlsWrapper ();
  return createHTMLElement (
      "div"
    , {className: "controls"}
    , progressBar
    , wrapper
  )
}

export default createControls