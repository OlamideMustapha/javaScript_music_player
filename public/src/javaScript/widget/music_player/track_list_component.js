import  { createHTMLElement } from "../helper.js"

const createTrackCover = ({format, data,}) => {
  let buffer = btoa(String.fromCharCode.apply(null, new Uint8Array(data.data)));
  let source = `data:image/png;base64,${buffer}`
  return createHTMLElement (
    'img'
  , { src: source
    , className: "track_cover"});
}


const createAlbumYearElement = year => createHTMLElement (
  "li", {className: "album_year"}, year.toString ()
);


const createTitleElement = title => createHTMLElement (
  "h1", {className: "track_name"}, title
);


const createTrackArtistNameElement = names => {
  return createHTMLElement ( "li"
          , {className: "artists"}
          , ...names)};


const createAlbumNameElement = name => createHTMLElement (
  "li", {className: "album_name"}, name
);


const createAlbumGenreElement = genre => createHTMLElement (
  "li",{className: "genre"}, ...genre
);

function selectTrack (id) {
  const allTracks = document.querySelectorAll (".track");
  const track = document.querySelector (`#${id}`);
  allTracks.forEach (track => track.classList.remove ("select"));

  track.classList.add ("select")
}

export const createTrack = (props) => {
  const title = createTitleElement (props.title),
        artists = createTrackArtistNameElement (props.artists),
        year = createAlbumYearElement (props.year),
        genre = createAlbumGenreElement (props.genre),
        album = createAlbumNameElement (props.album),
        cover = createTrackCover (props.picture[0]),
        id = props.title.split (" ").join ("-");

  const trackData = createHTMLElement (
    "ul"
  , {className: "trackData"}
  , artists
  , year
  , genre
  , album
  );

  const metadataWrapper = createHTMLElement (
    "div"
  , {className: "metadata_wrapper"}
  , title
  , trackData
  );


  const track = createHTMLElement (
    "div"
  , {id: id
    , className: "track"
    , onclick: () => selectTrack (id)}
  , cover
  , metadataWrapper
  );

  return track;
};


class Track {

  createTrackCover ({format, data,}) {
    let buffer = btoa(String.fromCharCode.apply(null, new Uint8Array(data.data)));
    let source = `data:image/png;base64,${buffer}`
    return createHTMLElement (
      'img'
    , { src: source
      , className: "track_cover"});
  }

  createAlbumYearElement () {
    createHTMLElement (
    "li", {className: "album_year"}, this.year.toString ()
  )}
  createTitleElement () { createHTMLElement (
    "h1", {className: "track_name"}, this.title
  )}

  createTrackArtistNameElement ()  {
    return createHTMLElement ( "li"
            , {className: "artists"}
            , ...this.artists)};

  createAlbumNameElement () { createHTMLElement (
    "li", {className: "album_name"}, this.album
  )}

  createAlbumGenreElement () { createHTMLElement (
    "li",{className: "genre"}, ...this.genre
  )}

  selectTrack () {
    const allTracks = document.querySelectorAll (".track")
    const track = document.querySelector (`#${props.title}`);
    allTracks.forEach (track => {
      track.classList.remove ("select");
      console.log (track)
    })
  }

  constructor (props) {
    this.title = props.title;
    this.artists = props.artists;
    this.album = props.album;
    this.year = props.year;
    this.genre = props.genre;
    this.picture = props.picture [0];
    this.id = this.title.split (" ").join ("-");
  }

}
export default createTrack