import {createHTMLElement, convertBufferToSource}       from "../../../modules/helper.js"

export const coverDisplay = createHTMLElement (
  "div",
  {className: "track_cover_image"}
  , createHTMLElement ("img")
)


export function setCoverImage (url) {
  const el = document.querySelector (".track_cover_image > img")
    el .src = url
        ? convertBufferToSource (url)
        : 'src/images/cover.png'
}

export default coverDisplay