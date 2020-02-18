import { getAHtml } from '::helpers/exekC/html-to-ahtml';
import { Element } from '::helpers/exekC/ahtml-to-html/element';
import { clone } from 'ramda';

const cloneObj = ogObj => JSON.parse(JSON.stringify(ogObj));
const splitSelected = ({
  aHtmlAnchors: { startNode, endNode, midNodes },
  startOffset,
  endOffset
}) => {
  const left = cloneObj(startNode);
  const selected = {
    leftEdge: cloneObj(startNode),
    rightEdge: cloneObj(endNode),
    midNodes: cloneObj(midNodes)
  };
  const right = cloneObj(endNode);

  const startText = left._.substring(
    startOffset,
    aHtmlElHasAttribute(left.tags)('data-end') > -1 ? endOffset : undefined
  );
  left._ = left._.substring(0, startOffset);
  selected.leftEdge._ = startText;
  // selected._ += midNodes
  //   .map(val => (val._ ? val._ : val))
  //   .join('')
  //   .replace(/\n/g, ' ');

  const endText =
    aHtmlElHasAttribute(right.tags)('data-start') > -1
      ? ''
      : right._.substring(0, endOffset);
  right._ = right._.substring(endOffset);
  selected.rightEdge._ = endText;
  return { left, selected, right };
};
const getElementOfNode = node =>
  node.nodeType === 3 ? node.parentElement : node;

const getSelectionAnchors = () => {
  const range = document.getSelection().getRangeAt(0);
  return {
    startElement: getElementOfNode(range.startContainer),
    endElement: getElementOfNode(range.endContainer),
    startOffset: range.startOffset,
    endOffset: range.endOffset
  };
};
const getSelectionAHtml = ({ rootElement }) => {
  const containers: Node[] = Array.from(rootElement.children);
  const { abstractHtml } = getAHtml({
    containers,
    options: {
      useObjForTextNodes: true
    }
  });
  const abstractHtmlObj: any[] = JSON.parse(abstractHtml);
  return { abstractHtmlObj };
};
const applyTemporaryStamps = ({ startElement, endElement }) => {
  startElement.dataset.start = true;
  endElement.dataset.end = true;
};
const aHtmlElHasAttribute = (tagTuples = []) => key =>
  tagTuples.findIndex(([tagName, attributes]) => attributes[key]);
const getAHtmlAnchors = ({ abstractHtmlObj }) => {
  const { startNode, endNode, midNodes } = abstractHtmlObj.reduce(
    (acc, val) => {
      const indexOfSelectionTarget_start = aHtmlElHasAttribute(val.tags)(
        'data-start'
      );
      const indexOfSelectionTarget_end = aHtmlElHasAttribute(val.tags)(
        'data-end'
      );
      if (indexOfSelectionTarget_start > -1) {
        val.indexOfSelectionTarget_start = indexOfSelectionTarget_start;
        acc.startNode = val;
      }
      if (indexOfSelectionTarget_end > -1) {
        val.indexOfSelectionTarget_end = indexOfSelectionTarget_end;
        acc.endNode = val;
      }
      const isMidNode =
        indexOfSelectionTarget_start === -1 && acc.startNode && !acc.endNode;
      if (isMidNode) acc.midNodes.push(val);
      return acc;
    },
    { startNode: undefined, endNode: undefined, midNodes: [] }
  );
  return { startNode, endNode, midNodes };
};

const deleteTemporaryStamps = aHtmlElement =>
  aHtmlElement.tags.map(([tagName, attributes]) => [
    tagName,
    (['data-start', 'data-end'].forEach(
      attribute => delete attributes[attribute]
    ),
    attributes)
  ]);
const extractSelection = () => {
  const {
    startElement,
    endElement,
    startOffset,
    endOffset
  } = getSelectionAnchors();
  applyTemporaryStamps({ startElement, endElement });
  const rootElement = document.querySelector('#rich-text > article');
  const { startNode, endNode, midNodes } = getAHtmlAnchors(
    getSelectionAHtml({ rootElement })
  );
  const { left, selected, right } = splitSelected({
    aHtmlAnchors: { startNode, midNodes, endNode },
    startOffset,
    endOffset
  });
  return { selected, startElement, endElement, left, right, midNodes };
};

type TApplyTag = {
  tag?: { tagName: string; tagExists: boolean };
  style?: string;
  aHtmlElement: any;
};
const applyTag = ({
  tag: { tagName, tagExists },
  style,
  aHtmlElement
}: TApplyTag) => {
  const newAHtmlElement = cloneObj(aHtmlElement);
  if (tagName) {
    const toBeDeleted = newAHtmlElement.tags.find(([tag]) => tag === tagName);
    if (tagExists) {
      if (toBeDeleted) {
        const indexOfTagToBeDeleted = newAHtmlElement.tags.indexOf(toBeDeleted);
        newAHtmlElement.tags.splice(indexOfTagToBeDeleted, 1);
        // merge styles of the item to be deleted with the top-level tag tag
        if (toBeDeleted[1].style)
          newAHtmlElement.tags[0][1].style =
            toBeDeleted[1].style + newAHtmlElement.tags[0][1].style;
      }
    } else {
      if (!toBeDeleted) newAHtmlElement.tags.push([tagName, {}]);
    }
  }
  if (style) {

    newAHtmlElement.tags[0][1].style = newAHtmlElement.tags[0][1].style + style;
  }
  return newAHtmlElement;
};

const getParent = ({ nestLevel, element }) =>
  nestLevel > 0
    ? getParent({ nestLevel: nestLevel - 1, element: element.parentElement })
    : element;
// https://stackoverflow.com/a/42448876
const toNodes = html =>
  new DOMParser().parseFromString(html, 'text/html').body.childNodes[0];

const deleteInBetween = ({ startElement, endElement }) => {
  if (startElement.nextElementSibling !== endElement) {
    startElement.nextElementSibling.remove();
    deleteInBetween({ startElement, endElement });
  }
};
const getFirstElementOfNextLine = element =>
  element.parentElement.nextElementSibling.firstElementChild;
const getNextLine = element => element.parentElement.nextElementSibling;
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
  // const newStartElement = toNodes(Element({ node: left }));
  // const newSelectedElement = [
  //   selected.leftEdge,
  //   ...selected.midNodes,
  //   selected.rightEdge
  // ].map(node => toNodes(node === '\n' ? '\n' : Element({ node })));
  // const newEndElement = toNodes(Element({ node: right }));
  //   newSelectedElements[0].push(newStartElement);
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

const exekC = ({ tagName, style }: { tagName?: string; style?: string }) => {
  const {
    left,
    right,
    selected,
    // midNodes,
    startElement,
    endElement
  } = extractSelection();
  [left, right, selected.leftEdge, selected.rightEdge].forEach(
    deleteTemporaryStamps
  );
  const tagExists =
    tagName && selected.leftEdge.tags.some(([tag]) => tag === tagName);
  const modifiedSelected = {
    leftEdge: applyTag({
      tag: { tagName, tagExists },
      style,
      aHtmlElement: selected.leftEdge
    }),
    rightEdge: applyTag({
      tag: { tagName, tagExists },
      style,
      aHtmlElement: selected.rightEdge
    }),
    midNodes: selected.midNodes.map(el =>
      typeof el === 'object'
        ? applyTag({
            tag: { tagName, tagExists },
            style,
            aHtmlElement: el
          })
        : el
    )
  };
  const startElementRoot = getParent({
    nestLevel: left.indexOfSelectionTarget_start,
    element: startElement
  });
  const endElementRoot = getParent({
    nestLevel: right.indexOfSelectionTarget_end,
    element: endElement
  });
  // const currentLine = startElementRoot.parentElement;
  // const arr = Array.from(currentLine.children);
  // const currentElementIndex = arr.indexOf(startElementRoot);
  // const oIndex = arr.indexOf(startElement);
  if (modifiedSelected.midNodes.length)
    // deleteInBetween({
    //   startElement: startElementRoot,
    //   endElement: endElementRoot
    // });
    // deleteInBetweenElements({
    //   startElement: startElementRoot,
    //   endElement: endElementRoot,
    //   midNodes
    // });
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

export { exekC };
