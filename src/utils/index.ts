export * from './component';
export * from './most';
export * from './classes';

export function setLabel(label) {
  return function (obj) {
    return {[label]: obj}
  }
}

// TODO : look at https://github.com/unshiftio/url-parse as a replacement
export function readRouteParams(_str): Object & any {
  let vars = {};
  // copy that string to not modify it
  const str = (' ' + _str).slice(1);

  str.replace(
    /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
    function (m, key, value) { // callback
      vars[key] = value !== undefined ? value : '';
      return ""
    }
  );

  return vars;
}

