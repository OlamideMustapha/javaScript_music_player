import { getTracks, playTrack } from "../tracks.js"
import { toggleShuffle }        from "../../music_widget.js"
import { createButton }         from "../../../../modules/helper.js"


export function shuffleTracks () {
  const tracks = getTracks (), // imported
        length = tracks.length,
        randomIndex = Math.floor(Math.random () * length),
        randomTrack = tracks[randomIndex],
        path = randomTrack.path;
  playTrack (path, randomTrack.cover); // imported
}

export const shuffle = createButton (
  {attributes: {
    id: "shuffle_btn"
  , className: "control_btn"
  , type: "image"
  , alt: "playlist"
  , src: "src/images/shuffle.svg"
  , onclick: () => toggleShuffle ()} // imported
  , text: ""}
  );

export default shuffle
