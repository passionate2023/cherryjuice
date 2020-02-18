import {
  getAHtml,
  getParentAttributes
} from '::helpers/execK/helpers/html-to-ahtml';
import { Element } from '::helpers/execK/helpers/ahtml-to-html/element';
import { cloneObj, toNodes } from '::helpers/execK/helpers';

const helpers = {
  getElementOfNode: node => (node.nodeType === 3 ? node.parentElement : node),
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

  wrapChildrenInSpan: ({ parentElement }) => {
    const aHtml = {
      _: parentElement.firstChild.wholeText,
      tags: getParentAttributes({ parentElement: parentElement })
    };
    const element = Element({ node: aHtml });
    parentElement.firstChild.replaceWith(toNodes(element));
  },

  aHtmlElHasAttribute: (tagTuples = []) => key =>
    tagTuples.findIndex(([tagName, attributes]) => attributes[key])
};

const getSelectionAnchors = () => {
  const range = document.getSelection().getRangeAt(0);
  return {
    startElement: helpers.getElementOfNode(range.startContainer),
    endElement: helpers.getElementOfNode(range.endContainer),
    startOffset: range.startOffset,
    endOffset: range.endOffset
  };
};

const pointSelectionAnchorToChild = ({ element }) => {
  let newElement = element;
  const isLineTheSelectionTarget = element.classList.contains(
    'rich-text__line'
  );
  if (isLineTheSelectionTarget) {
    if (element.firstChild.nodeType === Node.TEXT_NODE) {
      helpers.wrapChildrenInSpan({ parentElement: element });
    }
    newElement = element.firstChild;
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
    helpers.getSelectionAHtml({ rootElement })
  );
  const { left, selected, right } = splitSelected({
    aHtmlAnchors: { startNode, midNodes, endNode },
    startOffset,
    endOffset
  });

  [left, right, selected.leftEdge, selected.rightEdge].forEach(
    deleteTemporaryStamps
  );
  return { selected, startElement, endElement, left, right, midNodes };
};

export { extractSelection };
