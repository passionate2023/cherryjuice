import { cloneObj, toNodes } from '::helpers/execK/helpers';
import { Element } from '::helpers/execK/helpers/ahtml-to-html/element';
import { start } from 'repl';
import { deleteInBetweenElements } from '::helpers/execK/steps/apply-changes/delete-in-between-elements';

const getParent = ({ nestLevel, element }) =>
  nestLevel > 0
    ? getParent({ nestLevel: nestLevel - 1, element: element.parentElement })
    : element;

const aHtmlToElement = ({ node }) =>
  node.type ? node.outerHTML : Element({ node });

const createNewElements = ({ left, right, selected }) => {
  const newStartElement = toNodes(aHtmlToElement({ node: left }));
  const newSelectedElements = [
    selected.leftEdge,
    ...selected.midNodes,
    selected.rightEdge
  ].reduce(
    (acc, node) =>
      node === '\n'
        ? [...acc, []]
        : (acc[acc.length - 1].push(toNodes(aHtmlToElement({ node }))), acc),
    [[]]
  );
  const newEndElement = toNodes(aHtmlToElement({ node: right }));
  return { newStartElement, newSelectedElements, newEndElement };
};

type TFilterEmptyNodes = (arr: HTMLElement[]) => HTMLElement[];
const filterEmptyNodes: TFilterEmptyNodes = arr =>
  arr.filter(el => Boolean(el.innerText) || Boolean(el.localName === 'img'));

type TReplaceElement = (el: HTMLElement) => (arr: HTMLElement[]) => void;
const replaceElement: TReplaceElement = el => arr =>
  el.replaceWith(...filterEmptyNodes(arr));

const isElementALineContainer = element =>
  element.classList.contains('rich-text__line');

const applyChangesToDom = ({
  startElementRoot,
  endElementRoot,
  newStartElement,
  newSelectedElements,
  newEndElement
}) => {
  if (endElementRoot === startElementRoot) {
    replaceElement(startElementRoot)([
      newStartElement,
      ...newSelectedElements.flatMap(el => el),
      newEndElement
    ]);
  } else {
    let currentLine = startElementRoot.parentElement;
    if (!isElementALineContainer(currentLine))
      throw Error('Element is not a line');
    const firstLine = newSelectedElements[0];
    replaceElement(startElementRoot)([newStartElement, ...firstLine]);
    newSelectedElements
      .filter((el, i) => i > 0)
      .forEach(line => {
        currentLine = currentLine.nextElementSibling;
        if (!isElementALineContainer(currentLine))
          throw Error('Element is not a line');
        currentLine.prepend(...filterEmptyNodes(line));
      });
    replaceElement(endElementRoot)([newEndElement]);
  }
};

const applyChanges = ({
  left,
  startElement,
  right,
  endElement,
  modifiedSelected
}) => {
  const startElementRoot = getParent({
    nestLevel: left.indexOfSelectionTarget_start,
    element: startElement
  });
  const endElementRoot = getParent({
    nestLevel: right.indexOfSelectionTarget_end,
    element: endElement
  });
  if (modifiedSelected.midNodes.length)
    deleteInBetweenElements({
      midNodes: JSON.parse(JSON.stringify(modifiedSelected.midNodes)),
      endElementRoot,
      currentLine: startElementRoot.parentElement,
      currentElementIndex:
        Array.from(startElementRoot.parentElement.childNodes).indexOf(
          startElementRoot
        ) + 1
    });

  const {
    newStartElement,
    newSelectedElements,
    newEndElement
  } = createNewElements({
    left,
    selected: modifiedSelected,
    right
  });
  applyChangesToDom({
    startElementRoot,
    endElementRoot,
    newStartElement,
    newSelectedElements,
    newEndElement
  });
  return { newStartElement, newSelectedElements, newEndElement };
};

export { applyChanges };
