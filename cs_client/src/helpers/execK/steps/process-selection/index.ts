import {
  getAHtml,
  getParentAttributes
} from '::helpers/execK/helpers/html-to-ahtml';
import { Element } from '::helpers/execK/helpers/ahtml-to-html/element';
import { cloneObj, toNodes } from '::helpers/execK/helpers';

const helpers = {
  getSelectionAHtml: ({ rootElement }) => {
    const containers: Node[] = Array.from(rootElement.children);
    const { abstractHtml } = getAHtml({
      containers,
      options: {
        useObjForTextNodes: true
      }
    });
    const abstractHtmlObj: any[] = JSON.parse(abstractHtml);
    return { abstractHtmlObj };
  },

  wrapChildrenInSpan: ({
    parentElement,
    childAccessor
  }: {
    parentElement: HTMLElement;
    childAccessor: string;
  }) => {
    const aHtml = {
      _: parentElement[childAccessor].wholeText,
      tags: getParentAttributes({ parentElement: parentElement })
    };
    const element = Element({ node: aHtml });
    parentElement[childAccessor].replaceWith(toNodes(element));
  },

  aHtmlElHasAttribute: (tagTuples = []) => key =>
    tagTuples.findIndex(([tagName, attributes]) => attributes[key])
};

const pointSelectionAnchorToChild = ({ element, start }) => {
  let newElement = element;
  const isLineTheSelectionTarget = element.classList.contains(
    'rich-text__line'
  );
  if (isLineTheSelectionTarget) {
    const childAccessor = start ? 'firstChild' : 'lastChild';
    if (element[childAccessor].nodeType === Node.TEXT_NODE) {
      helpers.wrapChildrenInSpan({ parentElement: element, childAccessor });
    }
    newElement = element[childAccessor];
  }
  return newElement;
};

const applyTemporaryStamps = ({ startElement, endElement }) => {
  startElement.dataset.start = true;
  endElement.dataset.end = true;
};

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
    helpers.aHtmlElHasAttribute(left.tags)('data-end') > -1
      ? endOffset
      : undefined
  );
  left._ = left._.substring(0, startOffset);
  selected.leftEdge._ = startText;
  // selected._ += midNodes
  //   .map(val => (val._ ? val._ : val))
  //   .join('')
  //   .replace(/\n/g, ' ');

  const endText =
    helpers.aHtmlElHasAttribute(right.tags)('data-start') > -1
      ? ''
      : right._.substring(0, endOffset);
  right._ = right._.substring(endOffset);
  selected.rightEdge._ = endText;
  return { left, selected, right };
};

const getAHtmlAnchors = ({ abstractHtmlObj }) => {
  const { startNode, endNode, midNodes } = abstractHtmlObj.reduce(
    (acc, val) => {
      const indexOfSelectionTarget_start = helpers.aHtmlElHasAttribute(
        val.tags
      )('data-start');
      const indexOfSelectionTarget_end = helpers.aHtmlElHasAttribute(val.tags)(
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

const wrapTextNodesInSpan = arr =>
  arr.map(val =>
    typeof val === 'object' && !val.tags.length
      ? (val.tags.push(['span', {}]), val)
      : val
  );

const processSelection = ({
  startElement,
  endElement,
  startOffset,
  endOffset
}) => {
  startElement = pointSelectionAnchorToChild({
    element: startElement,
    start: true
  });
  endElement = pointSelectionAnchorToChild({
    element: endElement,
    start: false
  });
  applyTemporaryStamps({ startElement, endElement });
  const { startNode, endNode, midNodes } = getAHtmlAnchors(
    helpers.getSelectionAHtml({
      rootElement: document.querySelector('#rich-text > article')
    })
  );
  const { left, selected, right } = splitSelected({
    aHtmlAnchors: {
      startNode,
      midNodes: wrapTextNodesInSpan(midNodes),
      endNode
    },
    startOffset,
    endOffset
  });

  [left, right, selected.leftEdge, selected.rightEdge].forEach(
    deleteTemporaryStamps
  );
  return {
    selected,
    left,
    right,
    correctedStartElement: startElement,
    correctedEndElement: endElement
  };
};

export { processSelection };
