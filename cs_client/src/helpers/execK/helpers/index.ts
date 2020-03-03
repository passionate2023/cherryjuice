// https://stackoverflow.com/a/42448876
const toNodes: (string) => Element = html =>
  new DOMParser().parseFromString(html, 'text/html').body.children[0];

const cloneObj = ogObj => JSON.parse(JSON.stringify(ogObj));

export { toNodes, cloneObj };
