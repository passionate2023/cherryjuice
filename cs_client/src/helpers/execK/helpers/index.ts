// https://stackoverflow.com/a/42448876
const toNodes = html =>
  new DOMParser().parseFromString(html, 'text/html').body.childNodes[0];

const cloneObj = ogObj => JSON.parse(JSON.stringify(ogObj));

export { toNodes, cloneObj };
