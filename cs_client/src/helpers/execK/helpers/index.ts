// https://stackoverflow.com/a/42448876
const toNodes: (string) => Element = html =>
  new DOMParser().parseFromString(html, 'text/html').body.children[0];

const cloneObj = ogObj => JSON.parse(JSON.stringify(ogObj));

const nonTextualElements = ['img', 'table'];
const isElementNonTextual = node => nonTextualElements.includes(node.localName);
const getInnerText = node => {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.wholeText;
  }
  if (node.nodeType === Node.ELEMENT_NODE) {
    return isElementNonTextual(node) ? '' : node.innerText;
  }
  return '';
};
export { toNodes, cloneObj, getInnerText, isElementNonTextual };
