import { getAHtml, getParentAttributes } from '::helpers/execK/html-to-ahtml';
import { Element } from '::helpers/execK/ahtml-to-html/element';

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

const wrapChildrenInSpan = ({ parentElement }) => {
  const aHtml = {
    _: parentElement.firstChild.wholeText,
    tags: getParentAttributes({ parentElement: parentElement })
  };
  const element = Element({ node: aHtml });
  parentElement.firstChild.replaceWith(toNodes(element));
};
const pointSelectionAnchorToChild = ({ element }) => {
  let newElement = element;
  const isLineTheSelectionTarget = element.classList.contains(
    'rich-text__line'
  );
  if (isLineTheSelectionTarget) {
    if (element.firstChild.nodeType === Node.TEXT_NODE) {
      wrapChildrenInSpan({ parentElement: element });
    }
    newElement = element.firstChild;
  }
  return newElement;
};
const extractSelection = () => {
  let {
    startElement,
    endElement,
    startOffset,
    endOffset
  } = getSelectionAnchors();
  startElement = pointSelectionAnchorToChild({ element: startElement });
  endElement = pointSelectionAnchorToChild({ element: endElement });
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

type TApplyCommand = {
  tag?: { tagName: string; tagExists: boolean };
  style?: { style: string; styleExists: boolean };
  aHtmlElement: any;
};
const applyCommand = ({
  tag: { tagName, tagExists },
  style: { style, styleExists },
  aHtmlElement
}: TApplyCommand) => {
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
    newAHtmlElement.tags = newAHtmlElement.tags.map(([tagName, attributes]) => [
      tagName,
      {
        ...attributes,
        style: applyStyles({
          ogStyle: attributes.style,
          styleToBeApplied: style,
          styleExists
        })
      }
    ]);
  }
  return newAHtmlElement;
};

const applyStyles = ({
  ogStyle = '',
  styleToBeApplied,
  styleExists: styleExistsGlobally
}: {
  ogStyle: string;
  styleToBeApplied: string;
  styleExists: boolean;
}) => {
  if (styleExistsGlobally) {
    ogStyle = ogStyle.replace(styleToBeApplied, '');
  } else {
    ogStyle += ogStyle.includes(styleToBeApplied) ? '' : styleToBeApplied;
  }
  return ogStyle;
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

const execK = ({ tagName, style }: { tagName?: string; style?: string }) => {
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

  const styleExists =
    style &&
    selected.leftEdge.tags.some(
      ([_, { style: existingStyle }]) =>
        existingStyle && existingStyle.includes(style)
    );
  const modifiedSelected = {
    leftEdge: applyCommand({
      tag: { tagName, tagExists },
      style: { style, styleExists },
      aHtmlElement: selected.leftEdge
    }),
    rightEdge: applyCommand({
      tag: { tagName, tagExists },
      style: { style, styleExists },
      aHtmlElement: selected.rightEdge
    }),
    midNodes: selected.midNodes.map(el =>
      typeof el === 'object'
        ? applyCommand({
            tag: { tagName, tagExists },
            style: { style, styleExists },
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

export { execK };
