import musicPlayer           from "./widget/music_player/music_widget.js"
import { createHTMLElement } from "./modules/helper.js"


function init () {
  const rootPage = document.getElementById ("root");
  rootPage.appendChild (musicPlayer ());
}


document.body.onload = init ();
