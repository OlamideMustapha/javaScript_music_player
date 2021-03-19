import {createHTMLElement
     , truncateString }     from "../../../modules/helper.js"
import {getTracks }         from "./tracks.js"
import {filePickerWrapper } from "./file_picker.js"
import createControls from "./controls_component.js"

export function toggleHeaderTitle () {
  const headerTitle = document.querySelector (".current-track")

  const isTitleHidden = headerTitle.classList.contains ("hide")
  if (isTitleHidden) {
    headerTitle.classList.remove ("hide")
    headerTitle.classList.add ("show")
  } else {
    headerTitle.classList.remove ("show")
    headerTitle.classList.add ("hide")
  }
}


const toggleMusicPlayerDisplay = () => {
  const player = document.querySelector ("#music_player"),
        isHidden = player.classList.contains ("hide")
  if (isHidden) {
    player.classList.remove ("hide")
    player.classList.add ("show")
  } else {
    player.classList.remove ("show")
    player.classList.add ("hide")
  }
  toggleHeaderTitle () // imported
}


const musicToggleButton = createHTMLElement (
  "button"
, {className: "music-toggle_button"
  ,onclick: toggleMusicPlayerDisplay}
, "Music"
);


const filePickerToggleButton = createHTMLElement (
  "input"
  , { className: "file-picker-toggle_btn"
    , type: "image"
    , alt: "Folder"
    , toggleState: "false"
    , src: "src/images/folder.svg"
    , onclick: handleFilePickerToggle
    }
);


const setToggleState = (state, htmlButton) => {
  htmlButton.toggleState = state
}


function handleFilePickerToggle (event) {
  const isToggled = event.target.toggleState == "true",
        header = document.querySelector (".music-header_wrapper");
  if (isToggled) {
    const filePickerWrapperElement = document.querySelector (".dropdown");
    filePickerWrapperElement.remove ();
    setToggleState ("false", event.target);
  } else {
    header.appendChild (filePickerWrapper); // imported
    setToggleState ("true", event.target)
  }
}



const filePickerAndToggleButtonWrapper = createHTMLElement (
    "div"
  , {className: "toggle-button_wrapper"}
  , musicToggleButton
  , filePickerToggleButton
  );

const currentTrackName = createHTMLElement (
    "h2"
  , {className: "current-track hide"}
  , ""
  )

export function setCurrnetPlayingTrackDisplayName (path) {
  const htmlElement = document.querySelector (".current-track"),
        tracks = getTracks (), // imported
        trackIndex = tracks.findIndex (track => track.path === path),
        track = tracks [trackIndex],
        // title = truncateString (track.title ?? track.path, 16); // imported
        title = track.title ?? track.path
  htmlElement.textContent = title;
}

const header = () => {
  return createHTMLElement (
    "div"
  , {className: "music-header"}
  , filePickerAndToggleButtonWrapper
  , currentTrackName
)}

export const headerWrapper = createHTMLElement (
    "div"
  , {className: "music-header_wrapper"}
  , header ()
)

export default headerWrapper
