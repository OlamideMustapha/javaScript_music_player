import { createHTMLElement } from "../../../../modules/helper.js"


const getSecondsFromIncrementalTime = (incrementalTime) => {
  const sec  = incrementalTime % 60
  return sec.toFixed (0);
};

const getMinutesFromIncrementalTime = (incrementalTime) => {
  const min  = Math.floor ((incrementalTime / 60) % 60);
  return min.toFixed (0);
}


function increTimeToFieldBased (incrementalTime) {
  const seconds = getSecondsFromIncrementalTime (incrementalTime),
        minutes = getMinutesFromIncrementalTime (incrementalTime),
        fieldBased = `${minutes}:${seconds}`;
  return fieldBased;
}


const progressBar = createHTMLElement (
  "input"
, { type:"range"
  , id:"progress_bar"
  , className: "progress_bar"
  , min:"0"
  , max:"100"
  , value:"0"
  , step:"1"
  , onchange:handleProgessBarChange}
);


export function handleProgessBarChange (event) {
  let audio = document.querySelector(".audioDeck");
  audio.currentTime = Number (event.target.value);
}

export function resetProgessBar () {
  const bar = document.querySelector (".progress_bar");
  bar.value = 0;
}

export function updateProgessBar (event) {
  let bar = document.querySelector (".progress_bar"),
      currentTimeText = document.querySelector (".current-time_text"),
      value = event.target.currentTime,
      diff  = bar.value - value;

  if (diff > 1.5 || diff < -1.5) {
    event.target.currentTime = bar.value;
    currentTimeText.innerText = increTimeToFieldBased (bar.value);
  } else {
    bar.value = value;
    currentTimeText.innerText = increTimeToFieldBased (value);
  }
  
}

export function setProgessBarValues (event) {
  let bar = document.querySelector (".progress_bar"),
      durationText = document.querySelector (".track-duration_text");
  bar.max = event.target.duration;
  const duration = event.target.duration
  durationText.innerText = increTimeToFieldBased (duration);
}
const duration = createHTMLElement (
    "span", {className: "track-duration_text"}
  , "---"
  );

const currentTime = createHTMLElement (
    "span", {className: "current-time_text"}
  , "---"
  );

export const progressBarWrapper = createHTMLElement (
  "div", {className: "progress-bar_wrapper"}
  , currentTime
  , progressBar
  , duration
  );

export default progressBarWrapper
