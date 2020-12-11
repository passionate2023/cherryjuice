import { getDeepestFirstChild } from '::helpers/execK/steps/restore-selection';
import { trimOffset } from '::helpers/execK/helpers/trim-offset';

const stringToSingleElement = (singleElement: string): Element =>
  // https://stackoverflow.com/a/42448876
  new DOMParser().parseFromString(singleElement, 'text/html').body.children[0];
const stringToMultipleElements = (multipleElements: string): Element[] =>
  // https://stackoverflow.com/a/42448876
  Array.from(
    new DOMParser().parseFromString(multipleElements, 'text/html').body
      .children,
  );
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
  const node = getDeepestFirstChild(startElement);
  range.setStart(...trimOffset(node, offset));
  if (!endElement) range.collapse(true);
  else {
    const endNode = getDeepestFirstChild(endElement);
    range.setEnd(...trimOffset(endNode, endOffset));
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
  stringToSingleElement,
  stringToMultipleElements,
  getInnerText,
  isElementNonTextual,
  moveCursor,
  getAllElementsUntilElement,
  elementHasText,
};
