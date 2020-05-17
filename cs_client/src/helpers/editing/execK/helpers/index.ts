const toNodes: (string: string, single?: boolean) => Element | Element[] = (
  html,
  single = true,
) =>
  // https://stackoverflow.com/a/42448876
  [new DOMParser().parseFromString(html, 'text/html')].flatMap(({ body }) =>
    single ? body.children[0] : Array.from(body.children),
  )[0];

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
const elementHasText = el =>
  getInnerText(el).length || /(img)/.test(el.innerHTML);
const moveCursor = (
  { startElement, offset },
  { endOffset, endElement } = { endElement: undefined, endOffset: -1 },
) => {
  const range = document.createRange();
  range.setStart(startElement, offset);
  if (!endElement) range.collapse(true);
  else {
    range.setEnd(endElement, endOffset);
  }
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
};

const getAllElementsUntilElement = (
  list,
  endElement,
  startElement = undefined,
) => {
  const nextSibling = (list[list.length - 1] || startElement)
    .nextElementSibling;
  if (nextSibling !== endElement) {
    list.push(nextSibling);
    getAllElementsUntilElement(list, endElement);
  }
};
export {
  toNodes,
  cloneObj,
  getInnerText,
  isElementNonTextual,
  moveCursor,
  getAllElementsUntilElement,
  elementHasText,
};
