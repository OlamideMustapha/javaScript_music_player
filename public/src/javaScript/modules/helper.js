
function addHTMLAttributes (htmlElement, attributes) {
  for (let attributeValue in attributes)
    htmlElement[attributeValue] = attributes[attributeValue];
  return htmlElement;
}


function addChildElements (htmlElement, children) {
  children.forEach (child => {
    // checks wheather to append the child as a text or an element node
    typeof child === 'string'
      ? htmlElement.appendChild (document.createTextNode (child))
      : htmlElement.appendChild (child);
  });
  return htmlElement;
}

/**
 * createHTMLElement is a helper function for creating HTML elements
 * it takes the elementTagName of HTML element to be created as first
 * argument, the second argument is the id of the element
 * while the last argument can either be another HTML element to nest
 * within it or a text
 * @param {String} elementTagName
 * @param {String} idAttribute
 * @param  {...any} children
 */
export function createHTMLElement (
  elementTagName, attributes, ...children
  ) {
  let htmlElement = document.createElement (elementTagName);
      htmlElement = addHTMLAttributes (htmlElement, attributes);
      htmlElement = addChildElements (htmlElement, children);
  return htmlElement;
}


// button takes an object of properties as argument
// the object hold the id of the button and text
export const createButton = (props) =>
  createHTMLElement ("input"
                    , props.attributes
                    , props.text);


export function truncateString (str, length) {
  const strLength = str.length
  return strLength <= length ? str : (str.slice (0,length) + "...")
}

export function truncateStringFromLeft (str, length) {
  const strLength = str.length
  return strLength <= length ? str : ("..." + str.slice (strLength - length))
}

export function convertToValidId (str) {
  const validId = str.replace (/[^\w]/g, "");
  return validId;
}




export const convertBufferToSource = ({format, data}) => {
  const arr = new Uint8Array (data.data)
    .reduce ((acc, i) =>
      acc += String.fromCharCode.apply (null, [i]), '');

  let buffer = btoa (arr);
  return `data:${format};base64,${buffer}`;
};


export default createHTMLElement;
