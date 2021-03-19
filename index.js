import express         from "express"
import http            from "http"
import ecstatic        from "ecstatic"
import fs, { readdir } from "fs/promises"
import { statSync }    from "fs"
import {sep}           from "path"
import  mm             from "music-metadata"


const port   = process.argv?.[2] ?? 8080,
      app    = express (),
      server = http.createServer(app);



const supportedFormats = [".mp3", ".mp4"],
      isSupported = file =>
        supportedFormats.some (format => file.endsWith (format));



let directory = "",
    getTrackPath = trackName => `${directory}${sep}${trackName}`;



const getTrackNameFromURL = url => {
  const paths = url.split (sep),
        name  = paths[paths.length - 1];
  return name;
}

async function getTrack (path) {
  try {
    const track = await fs.readFile (path)
    return track;
  } catch (_) { console.log (`${path} not found`); }
}


async function getTracksInDirectory (dir) {
  try {
    const files = await readdir (dir),
        tracks  = files.filter (isSupported);
    return tracks;
  } catch (error) { console.error (error); }
  return [];
}

const getMatch = (files, query) =>
  files .filter (file => file.startsWith (query))

async function getFoldersInDirectory (dir, query) {
  const isNotRoot = !checkIfPathIsRoot (dir);
  try {
    if (isNotRoot) {
      const files = await readdir (dir);

      const allFiles = files.filter (file => {
        const path        = `${dir}${sep}${file}`,
              isDirectory = checkIfDirectorySync (path),
              isNotHidden = !checkIfFileIsHidden (file);
        return isDirectory && isNotHidden
      });
      const filteredFiles = getMatch (allFiles, query);
      return filteredFiles;
    } else return [];
  } catch (err) {
    console.log (`no ${dir} directory`);
  }
  return [];
}

const checkIfPathIsRoot   = (file) => file === "/",
      checkIfFileIsHidden = (file) => file.startsWith ("." || "..");

async function checkIfDirectory (dir) {
  try {
    const directoryStat = await fs.stat (dir),
          isDir         = directoryStat.isDirectory ();
    return isDir;
  } catch (_) {
    console.log (`can't find directory ${dir}`);
  }
  return false;
}

/* The synchronious version of checkIfDirectory */
function checkIfDirectorySync (dir) {
  try {
    const directoryStat = statSync (dir),
          isDir         = directoryStat.isDirectory ();
    return isDir;
  } catch (err) {
    console.log (`can't find directory ${dir}`);
  }
  return false;
}


async function getTrackMetadata  (file, track) {
  const metadata = await mm.parseFile (file),
        { picture
        , artists
        , artist
        , title
        , year
        , album} = metadata.common;
  return  {title, artists, artist, year, album, picture, path: track};
}

async function getAllMetadataFromDirectory (dir) {
  const tracks      = await getTracksInDirectory (dir),
        allMetadata = tracks.map (track => {
          const trackPath = getTrackPath (track);
          return getTrackMetadata (trackPath, track);
        });
  return Promise.all (allMetadata);
}


app.use (ecstatic ({
    root: `./public`
  , showdir: true
  , cache: 'no store'}
  ));

app.get (/^\/(home|run)\/*/, (request, response) => {
  const url       = decodeURIComponent (request.url),
        trackName = getTrackNameFromURL (url),
        trackPath = getTrackPath (trackName);
  getTrackMetadata (trackPath, trackName)
    .then (metadata => {
      response.status (200).send (metadata);
    })
    .catch ((err) => {
      response.status (400).json (err);
    });
});


app.get (/^\/music\/*/, (request, response) => {
  const url       = decodeURIComponent (request.url),
        trackName = getTrackNameFromURL (url),
        trackPath = getTrackPath (trackName);
  getTrack (trackPath)
    .then (track => {
      response.status (200).send (track);
    })
    .catch (console.log)
});

function queryString (path) {
  const arr       = path.split (sep),
        query     = arr.pop (),
        queryPath = arr.join (sep);
  return {queryPath, query};
}

app.get (/^\/suggestions\/*/, (request, response) => {
  directory = decodeURIComponent (request.url)
    .split ("/suggestions")[1];

  const { queryPath
        , query } = queryString (directory);

  checkIfDirectory (queryPath == "" ? "/" : queryPath)
    .then (isDirectory => {
      if (isDirectory) {
        getFoldersInDirectory (queryPath, query)
          .then (suggestions => {
            response.status (200).json (suggestions);
          });
      } else {
        response.status (200).json ([]);
      }
    })
    .catch (console.log);
});

server.listen(port
  , () => console.log(`Listening on: ${port}...`));


/* adding support for server to reply with a specified limit */
const size = 10
let limit = {start: 0, end: size};
const updateLimit = (startIndex, endIndex) => (
  {start: startIndex, end: endIndex})
let currentTracks = [];

const storeTracksToMemory = tracks => {
  currentTracks = tracks;
}


app.get (/^\/tracks\/*/, (request, response) => {
  const {path, type} = request.query;
  getTracks (path, type)
    .then (() => sendMetadataInBatch (request, response))
    .catch (console.log);
});


function sendMetadataInBatch (request, response) {
  const {start, end} = limit,
        tracks = currentTracks.slice (start,end);
  limit = updateLimit (end, end + size);
  response.status (200).json (tracks);
}

async function getTracks (path, type) {
  if (type == "initial") {
    directory = path;
    limit = updateLimit (0, size);

    const isDirectory = await checkIfDirectory (directory);
    if (isDirectory) {
      const tracks = await getTracksInDirectory (directory);
      storeTracksToMemory (tracks);
    }
  }
  return
}

// app.get (/^\/tracks\/*/, (request, response) => {
//   dir = decodeURIComponent (request.url).split ("/tracks")[1];
//   checkIfDirectory (dir)
//     .then (isDirectory => {
//       if (isDirectory)
//         getTracksInDirectory (dir)
//           .then (tracks => {
//             response.status (200).send (JSON.stringify (tracks));
//           })
//           .catch (console.log);
//     })
//     .catch (console.log);
// });
