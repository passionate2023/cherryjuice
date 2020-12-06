import { cloneObj } from '::helpers/objects';
const Stamps = {
  start: 'selection-start',
  end: 'selection-end',
  offset: 'selection-offset',
  genStamps: (stampPrefix = '') => {
    Stamps.start = `${stampPrefix}selection-start-${new Date().getTime()}`;
    Stamps.offset = `${stampPrefix}selection-offset-${new Date().getTime()}`;
    Stamps.end = `${stampPrefix}selection-end-${new Date().getTime()}`;
  },
};
const helpers = {
  aHtmlElHasAttribute: (tagTuples = []) => key =>
    tagTuples.findIndex(([, attributes]) => attributes[key]),
};

const applyTemporaryStamps = ({
  startElement,
  endElement,
  stampPrefix,
  offset,
}: {
  startElement?: Element;
  endElement?: Element;
  offset?: number;
  stampPrefix?: string;
}) => {
  Stamps.genStamps(stampPrefix);
  startElement && startElement.setAttribute(Stamps.start, 'true');
  endElement && endElement.setAttribute(Stamps.end, 'true');
  startElement.setAttribute(Stamps.offset, '' + offset);
  return { start: Stamps.start, end: Stamps.end };
};
const deleteTemporaryStamps = ({
  startElement,
  endElement,
}: {
  startElement?: Element;
  endElement?: Element;
}) => {
  startElement && startElement.removeAttribute(Stamps.start);
  startElement && endElement.removeAttribute(Stamps.offset);
  endElement && endElement.removeAttribute(Stamps.end);
};
const splitSelected = ({
  aHtmlAnchors: { startNode, endNode, midNodes },
  startOffset,
  endOffset,
}) => {
  const left = cloneObj(startNode);
  const selected = {
    leftEdge: cloneObj(startNode),
    rightEdge: cloneObj(endNode),
    midNodes: cloneObj(midNodes),
  };
  const right = cloneObj(endNode);

  const startText = left._.substring(
    startOffset,
    helpers.aHtmlElHasAttribute(left.tags)(Stamps.end) > -1
      ? endOffset
      : undefined,
  );
  left._ = left._.substring(0, startOffset);
  selected.leftEdge._ = startText;

  const endText =
    helpers.aHtmlElHasAttribute(right.tags)(Stamps.start) > -1
      ? ''
      : right._.substring(0, endOffset);
  right._ = right._.substring(endOffset);
  selected.rightEdge._ = endText;
  return { left, selected, right };
};

const getAHtmlAnchors = ({ abstractHtml }) => {
  let { startNode, endNode, midNodes } = abstractHtml.reduce(
    (acc, val) => {
      const indexOfSelectionTarget_start = helpers.aHtmlElHasAttribute(
        val.tags,
      )(Stamps.start);
      const indexOfSelectionTarget_end = helpers.aHtmlElHasAttribute(val.tags)(
        Stamps.end,
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
    {
      startNode: undefined,
      endNode: undefined,
      midNodes: [],
    },
  );
  if (startNode === undefined) startNode = { _: '', tags: [] };
  if (endNode === undefined) endNode = { _: '', tags: [] };
  return { startNode, endNode, midNodes };
};

const deleteTemporaryStampsFromAHtml = aHtmlElement =>
  aHtmlElement.tags.map(([tagName, attributes]) => [
    tagName,
    ([Stamps.start, Stamps.end].forEach(
      attribute => delete attributes[attribute],
    ),
    attributes),
  ]);

export {
  applyTemporaryStamps,
  deleteTemporaryStamps,
  deleteTemporaryStampsFromAHtml,
  getAHtmlAnchors,
  splitSelected,
};
