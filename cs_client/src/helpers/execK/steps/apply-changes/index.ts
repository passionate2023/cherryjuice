import { toNodes } from '::helpers/execK/helpers';
import { Element } from '::helpers/execK/helpers/ahtml-to-html/element';

const getParent = ({ nestLevel, element }) =>
  nestLevel > 0
    ? getParent({ nestLevel: nestLevel - 1, element: element.parentElement })
    : element;

const deleteInBetweenElements = ({
  midNodes,
  endElementRoot,
  currentLine,
  currentElementIndex
}) => {
  let node = midNodes.shift();
  if (node === '\n') {
    currentLine = currentLine.nextElementSibling;
    currentElementIndex = 0;
  } else {
    const nextElementSibling = currentLine.children[currentElementIndex];
    if (nextElementSibling !== endElementRoot) {
      nextElementSibling.parentElement.removeChild(nextElementSibling);
    }
  }
  if (midNodes.length)
    deleteInBetweenElements({
      midNodes,
      endElementRoot,
      currentLine,
      currentElementIndex: currentElementIndex++
    });
};

const createNewElements = ({ left, right, selected }) => {
  const newStartElement = toNodes(Element({ node: left }));
  const newSelectedElements = [
    selected.leftEdge,
    ...selected.midNodes,
    selected.rightEdge
  ].reduce(
    (acc, node) =>
      node === '\n'
        ? [...acc, []]
        : (acc[acc.length - 1].push(toNodes(Element({ node }))), acc),
    [[]]
  );
  const newEndElement = toNodes(Element({ node: right }));
  return { newStartElement, newSelectedElements, newEndElement };
};

const applyChangesToDom = ({
  startElementRoot,
  endElementRoot,
  newStartElement,
  newSelectedElements,
  newEndElement
}) => {
  if (endElementRoot === startElementRoot) {
    startElementRoot.replaceWith(
      newStartElement,
      ...newSelectedElements.flatMap(el => el),
      newEndElement
    );
  } else {
    let currentLine = startElementRoot.parentElement;
    const firstLine = newSelectedElements.shift();
    startElementRoot.replaceWith(newStartElement, ...firstLine);
    newSelectedElements.forEach(line => {
      currentLine = currentLine.nextElementSibling;
      currentLine.prepend(...line);
    });

    endElementRoot.replaceWith(newEndElement);
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
        Array.from(startElementRoot.parentElement.children).indexOf(
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
};

export { applyChanges };
