
import {createHTMLElement
      , truncateStringFromLeft } from "../../../modules/helper.js"
import {addTrack
      , renderTrack
      , fetchTrackMetaData
      , extractTrackData
      , removeTracksHTMLComponent
      , renderIfEmptyDirectory } from "./tracks.js"



let stillFetching = false;
let currentDirectory = "";

function getCurrentDirectory () {
  return currentDirectory;
}

function setCurrentDirectory (newDirectory) {
  currentDirectory = newDirectory;
}


export const setFetchingStatus = (bool) => stillFetching = bool;
export const getFetchingStatus = () => stillFetching;


const filePickerButton = createHTMLElement (
  "input"
  , { className: "file-picker_btn"
    , type: "image"
    , src: "src/images/151845-music-player-icons/svg/down-arrow.svg"
    , alt: "Save"
    , onclick: fetchTrackFromDirectory
    }
  );

const filePicker = createHTMLElement (
  "input"
  , { className: "file-picker_input"
    , type: "text"
    , placeholder: "Enter Music Directory"
    , onkeyup: getFileNameSuggestions
    }
  );

const filePickerInputWrapper = createHTMLElement (
    "div"
  , {className: "file-picker_wrapper"}
  , filePicker
  , filePickerButton
  );


async function fetchAndRenderTracksMetadata (path, tracks) {
  const numberOfTracks = tracks.length;
  setFetchingStatus (true);

  if (numberOfTracks > 0) {
    const track    = tracks.shift (),
          fullPath = `${path}/${track}`,
          data     = await fetchTrackMetaData (fullPath); // imported

    addTrack (extractTrackData (data)); // imported
    await renderTrack (data);
    return fetchAndRenderTracksMetadata (path, tracks);
  } else {
    setFetchingStatus (false);
    return "done fetching tracks";
  }
}

async function fetchTrackFromDirectory () {
  let input = document.querySelector (".file-picker_input"),
      path  = input.value;
  setCurrentDirectory (path);
  removeTracksHTMLComponent ();
  try {
    const response = await fetch (`/tracks?path=${path}&type=initial`),
          data     = await response.json (),
          isEmpty = data.length < 1;
    isEmpty
      ? renderIfEmptyDirectory ()
      : fetchAndRenderTracksMetadata (path, data);
  } catch (error) {console.log (error)};
}



export async function fetchTrackFromDirectory2 () {
  let path = getCurrentDirectory ();
  const response = await fetch (`/tracks?type=rest`),
        data     = await response.json ();
  fetchAndRenderTracksMetadata (path, data);
}


const createDropdownItem = (dirPath, query) => {
  const suggested = createHTMLElement (
    "span", {className: "highlight-query"}, query );

  const {index, path} = getIndexAndPath ();

  const textWrapper = createHTMLElement (
      "a", {className: "dropdown-text"
            , href: path
            , index: index}
    , dirPath, suggested);

  function displaySuggestions (event) {
      event.preventDefault ();
      updatePickerAndFetch (index);
  }

  return createHTMLElement (
    "li", {className: "dropdown-item"
        , onclick: displaySuggestions}
  , textWrapper
  )
}

const dropdownContent = createHTMLElement (
    "ul"
  , {className: "dropdown-content"}
)

export const filePickerWrapper = createHTMLElement (
    "div"
  , {className: "dropdown"}
  , filePickerInputWrapper
  , dropdownContent
)

// removes dropDown
document.body.addEventListener ("click", () => {
  const dropDown = document.querySelector (".dropdown-content")
  if (dropDown)
    dropDown.style.display = "none";
});


let searchIndex = [];
const resetSearchIndex = () => searchIndex = [];
const addToSearchIndex = (path) => searchIndex.unshift (path);
const getFirstFromSearchIndex = () => searchIndex [0];

function getIndexAndPath () {
  const index = searchIndex.length,
        path = getFirstFromSearchIndex ();
  return {index, path};
}

function getPathFromDropdownComponent (index) {
  const links = document.querySelectorAll (`.dropdown-text`),
        element = Array.from (links).find (link => link.index == index),
        path = element.getAttribute ("href")
  return path
}


function updatePickerAndFetch (index) {
  const path = getPathFromDropdownComponent (index)
  document.querySelector (".file-picker_input").value = path;

  fetchTrackFromDirectory ();
}

function removeAllCurrentSuggestions  () {
  document.querySelectorAll (".dropdown-item").forEach (item => {
    item.remove ();
  });
}

function createSuggestionFullPath (path, suggestion) {
  const fullPath = path.endsWith ("/")
                      ? path + suggestion : path + "/" + suggestion;
  return fullPath;
}

function queryString (path) {
  const arr = path.split ("/"),
        query = arr.pop (),
        dirPath = arr.join ("/");
  return {dirPath, query}
}

function renderSuggestions (path, data) {
  const dropDown = document.querySelector (".dropdown-content");
  dropDown.style.display = "block";

  data.forEach (suggestion => {
    const fullPath = createSuggestionFullPath (path, suggestion);
    addToSearchIndex (fullPath);

    const truncatedPath = truncateStringFromLeft (fullPath, 30);
    const {dirPath, query} = queryString (truncatedPath),
          last = "/" + query,
          content = createDropdownItem (dirPath, last);

    dropDown.appendChild (content);
  });
}

async function fetchSuggestions (path) {
  const response = await fetch ("/suggestions" + path);
  return await response.json ();
}

function getFileNameSuggestions (event) {
  const path = event.target.value;
  resetSearchIndex ()

  fetchSuggestions (path)
    .then (data => {
      removeAllCurrentSuggestions ()
      const {dirPath} = queryString (path)
      renderSuggestions (dirPath, data)
    })
    .catch (console.log);
}

export default filePickerWrapper
