import {createHTMLElement
      , truncateString
      , convertToValidId
      , convertBufferToSource} from "../../../modules/helper.js"
import {playTrack }        from "./tracks.js"



const createTrackCover = (picture) => {
  let source = picture
                ? convertBufferToSource (picture)
                : "src/images/cover.png";

  return createHTMLElement (
    'img', { src: source
            , className: "track_cover"});
};

const createAlbumYearElement = year => createHTMLElement (
    "li"
  , {className: "album_year"}
  , year.toString ());

const createTitleElement = title => {
  const truncatedTitle = truncateString (title, 35)
  return createHTMLElement ( "h1"
                    , {className: "track-name"}
                    , truncatedTitle);
};

const createTrackArtistNameElement = nameList =>
  createHTMLElement (
      "li", {className: "artists"}
    , ...nameList);

const createAlbumNameElement = name =>
  createHTMLElement (
      "li", {className: "album_name"}
    , name);

const createAlbumGenreElement = genreList =>
  createHTMLElement (
      "li", {className: "genre"}
    , ...genreList);

function selectTrackBy (id) {
  const allTracks = document.querySelectorAll (".track"),
        track = document.querySelector (`#${id}`);
  allTracks.forEach (track => track.classList.remove ("select"));

  track.classList.add ("select")
}

function getTitleFromPath (path) {
  return path.split (".mp3"||".mp4")[0]

}

function createTrackInfo (props) {
  let info = [];
  for (const attribute in props) {
    const value = props[attribute];
    let HTMLElement;
    if (value)
      switch (attribute) {
        case "artists":
          HTMLElement = createTrackArtistNameElement (value);
          info = info.concat (HTMLElement);
          break;
        case "year":
          HTMLElement = createAlbumYearElement (value);
          info = info.concat (HTMLElement);
          break;
        case "genre":
          HTMLElement = createAlbumGenreElement (value);
          info = info.concat (HTMLElement);
          break;
        case "album":
          HTMLElement = createAlbumNameElement (value);
          info = info.concat (HTMLElement);
          break;
        default:
          // do nothing
      };
  }
  return info;
}

const trackInfoWrapper = (props) => {
  let childrenNodes = createTrackInfo (props)
  const trackInfo = createHTMLElement (
    "ul", {className: "trackData"}
  , ...childrenNodes
  );
  return trackInfo;
}


export const createTrack = (props) => {
  let trackTitle  = props.title ?? getTitleFromPath (props.path)
  const title     = createTitleElement (trackTitle),
        cover     = createTrackCover (props.picture?.[0]),
        inValidId = trackTitle.split (" ").join ("-"),
        id        = convertToValidId (inValidId),
        trackInfo = trackInfoWrapper (props);

  const metadataWrapper = createHTMLElement (
    "div", {className: "metadata_wrapper"}
  , title
  , trackInfo
  );


  const track = createHTMLElement (
    "div", { id: id
            , className: "track"
            , onclick: () => selectTrackBy (id)
            , ondblclick: () => playTrack (props.path, props.picture?.[0])}
  , cover
  , metadataWrapper
  );

  return track;
};

export default createTrack
