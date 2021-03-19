function searchString (str, value ) {
  let len = value.length

  function search (strValue, value, isPresent) {
    console.log (strValue)
    let stringLength = strValue.length
    if (stringLength > 0 || !isPresent) {
      let ifPresent = strValue.slice (0, len + 1) === value
      let subString = strValue.slice (1, stringLength + 1);
      // console.log (subString)
      return search (subString, value, ifPresent)
    } else {
      return "done"
    }
  }

  return search ("akin", value, false)
}
