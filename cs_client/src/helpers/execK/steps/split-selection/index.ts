import { getAHtml } from '::helpers/execK/helpers/html-to-ahtml';
import { cloneObj, toNodes } from '::helpers/execK/helpers';
const Stamps = {
  start: 'selection-start',
  end: 'selection-end'
};
const genStamps = () => {
  Stamps.start = `selection-start-${new Date().getTime()}`;
  Stamps.end = `selection-end-${new Date().getTime()}`;
};
const getSelectionAHtml = ({ rootElement }) => {
  const lines: Node[] = Array.from(rootElement.childNodes);
  const { abstractHtml } = getAHtml({
    lines,
    options: {
      useObjForTextNodes: true,
      serializeNonTextElements: true
    }
  });
  return { abstractHtmlObj: abstractHtml };
};
const helpers = {
  aHtmlElHasAttribute: (tagTuples = []) => key =>
    tagTuples.findIndex(([tagName, attributes]) => attributes[key])
};

const applyTemporaryStamps = ({ startElement, endElement }) => {
  // startElement.dataset[Stamps.start] = true;
  // endElement.dataset[Stamps.end] = true;
  genStamps();
  startElement.setAttribute(Stamps.start, true);
  endElement.setAttribute(Stamps.end, true);
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
    helpers.aHtmlElHasAttribute(left.tags)(Stamps.end) > -1
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
    helpers.aHtmlElHasAttribute(right.tags)(Stamps.start) > -1
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
      )(Stamps.start);
      const indexOfSelectionTarget_end = helpers.aHtmlElHasAttribute(val.tags)(
        Stamps.end
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
    ([Stamps.start, Stamps.end].forEach(
      attribute => delete attributes[attribute]
    ),
    attributes)
  ]);

// const wrapTextNodesInSpan = arr =>
//   arr.map(val =>
//     typeof val === 'object' && !val.tags.length
//       ? (val.tags.push(['span', {}]), val)
//       : val
//   );

// const processSelection = ({
//   startElement,
//   endElement,
//   startOffset,
//   endOffset
// }) => {
//   applyTemporaryStamps({ startElement, endElement });
//   const { startNode, endNode, midNodes } = getAHtmlAnchors(
//     getSelectionAHtml({
//       rootElement: document.querySelector('#rich-text > article')
//     })
//   );
//   const { left, selected, right } = splitSelected({
//     aHtmlAnchors: {
//       startNode,
//       midNodes: wrapTextNodesInSpan(midNodes),
//       endNode
//     },
//     startOffset,
//     endOffset
//   });
//
//   [left, right, selected.leftEdge, selected.rightEdge].forEach(
//     deleteTemporaryStamps
//   );
//   return {
//     selected,
//     left,
//     right,
//     correctedStartElement: startElement,
//     correctedEndElement: endElement
//   };
// };
const splitSelectionIntoThree = ({
  startElement,
  endElement,
  startOffset,
  endOffset
}) => {
  applyTemporaryStamps({ startElement, endElement });
  const { startNode, endNode, midNodes } = getAHtmlAnchors(
    getSelectionAHtml({
      rootElement: document.querySelector('#rich-text > article')
    })
  );
  const { left, selected, right } = splitSelected({
    aHtmlAnchors: {
      startNode,
      midNodes, //: wrapTextNodesInSpan(midNodes),
      endNode
    },
    startOffset,
    endOffset
  });

  [left, right, selected.leftEdge, selected.rightEdge].forEach(
    deleteTemporaryStamps
  );
  return { left, selected, right };
};
export { splitSelectionIntoThree, getSelectionAHtml };
