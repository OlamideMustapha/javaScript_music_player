import {createHTMLElement}  from "../../../modules/helper.js"
import {resetProgessBar }   from "./controls/progress_bar.js"
import createTrack          from "./track_component.js"
import {setAudioSourceURL } from "./audio_deck.js"
import {setCurrnetPlayingTrackDisplayName } from "./header_component.js"
import {getFetchingStatus
      , fetchTrackFromDirectory2 } from "./file_picker.js"
import {setCoverImage}         from "./cover_dispaly.js"


let tracks = [];

export const getTracks = () => tracks;
export const setTracks = (newTracks) => tracks = newTracks;
export const addTrack  = track => tracks.push (track)


function handleTracksWrapperScroll (event) {
  const target = event.target;
  const total = target.scrollHeight - target.clientHeight
  if (target.scrollTop == total)
    fetchTrackFromDirectory2 ()
    .catch (console.log);
}


export const tracksWrapper = createHTMLElement (
  "div"
, { className: "tracks_wrapper"
   ,onscroll: handleTracksWrapperScroll}
);

export function getIndexOfCurrentPlayingTrack (tracks) {
  return tracks.findIndex (track => track.isPlaying)
}

export function getNextTrack (tracks) {
  const currentIndex = getIndexOfCurrentPlayingTrack (tracks),
        totalLength  = tracks.length,
        nextIndex    = currentIndex >= totalLength ? 0 : currentIndex + 1,
        nextTrack    = tracks.find ((_, i) => i == nextIndex);
  updateTracksPlayingState (nextIndex)
  return nextTrack;
}


export function extractTrackData (track) {
  return { title:      track.title
          , artists:   track.artists
          , isPlaying: false
          , path: track.path
          , cover: track.picture?.[0]}
}

export function getSelected () {
  const tracks = document.querySelectorAll (".track");
        selected = Array.from(tracks)
                      .find (track => Array.from (track.classList)
                        .includes ("select"));
}

export function getPreviousTrack (tracks) {
  const currentIndex  = getIndexOfCurrentPlayingTrack (tracks),
        lastIndex     = tracks.length - 1,
        previousIndex = currentIndex <= 0 ? lastIndex : currentIndex-1,
        previousTrack = tracks.find ((_, i) => i == previousIndex);
  updateTracksPlayingState (previousIndex)
  return previousTrack;
}


export function getCurrentPlayingtrack (tracks) {
  return tracks.find (track => track.isPlaying);
}

export async function fetchTrackMetaData (path) {
  const response = await fetch (path)
  return await response.json ()
}

async function fetchTrack (path) {
  const res = await fetch(`/music/${path}`);
  return await res.blob();
}

export function removeTracksHTMLComponent () {
  const tracks = document.querySelector ('.tracks_wrapper').childNodes;
  Array.from (tracks) .forEach (track => track.remove ());
}


export function renderTracks (data) {

  const trackWrapper = document.querySelector ('.tracks_wrapper');
  removeTracksHTMLComponent ();
  data.forEach (track => {
    const trackHTMLComponent = createTrack (track); // imported

    setTimeout (() => {
      trackWrapper.appendChild (trackHTMLComponent)
    }, 1000)
  })
}

export function renderIfEmptyDirectory () {
  const trackWrapper = document.querySelector (".tracks_wrapper"),
        HTMLElement = createHTMLElement ( "div"
																				, { id: "empty-dir-msg" }
                                        , "No music file")
  trackWrapper.appendChild (HTMLElement)
}

export async function renderTrack (data) {
  const trackWrapper = document.querySelector ('.tracks_wrapper'),
        trackHTMLComponent = createTrack (data); // imported
  trackWrapper.appendChild (trackHTMLComponent)
}

export function updateTracksPlayingState (index) {
  const tracks = getTracks (),
        newTracks = tracks.map ((track, i) => {
          const isPlaying = i === index
          return {...track, isPlaying}
        });
  setTracks (newTracks);
}

export function playTrack (path, cover) {
  fetchTrack (path)
    .then (data => {
      const objectURL = URL.createObjectURL (data);
      resetProgessBar (); // imported
      setAudioSourceURL (objectURL); // imported
      return path;
    })
    .then (path => {
      const trackIndex = tracks.findIndex (track => track.path === path);

      setCurrnetPlayingTrackDisplayName (path); // imported
      updateTracksPlayingState (trackIndex);
    })
    .catch (console.log)
  
  
  setCoverImage (cover)
  
}


export default playTrack
