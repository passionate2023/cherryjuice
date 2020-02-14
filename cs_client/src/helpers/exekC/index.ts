import { getAHtml } from '::helpers/exekC/html-to-ahtml';
import { Element } from '::helpers/exekC/ahtml-to-html/element';

const cloneObj = ogObj => JSON.parse(JSON.stringify(ogObj));
const splitSelected = ({
  aHtmlAnchors: { startNode, endNode, midNodesText },
  startOffset,
  endOffset
}) => {
  const left = cloneObj(startNode);
  const selected = cloneObj(startNode);
  const right = cloneObj(endNode);

  const startText = left._.substring(
    startOffset,
    aHtmlElHasAttribute(left.tags)('data-end') > -1 ? endOffset : undefined
  );
  left._ = left._.substring(0, startOffset);
  selected._ = startText;
  selected._ += midNodesText.join('').replace(/\n/g, ' ');

  const endText =
    aHtmlElHasAttribute(right.tags)('data-start') > -1
      ? ''
      : right._.substring(0, endOffset);
  right._ = right._.substring(endOffset);
  selected._ += endText;
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
const aHtmlElHasAttribute = tagTuples => key =>
  tagTuples.findIndex(([tagName, attributes]) => attributes[key]);
const getAHtmlAnchors = ({ abstractHtmlObj }) => {
  const { startNode, endNode, midNodesText } = abstractHtmlObj.reduce(
    (acc, val) => {
      if (val.tags) {
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
      } else if (acc.startNode && !acc.endNode)
        acc.midNodesText.push(val._ ? val._ : val);
      return acc;
    },
    { startNode: undefined, endNode: undefined, midNodesText: [] }
  );
  return { startNode, endNode, midNodesText };
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
  const aHtmlAnchors = getAHtmlAnchors(getSelectionAHtml({ rootElement }));
  const { left, selected, right } = splitSelected({
    aHtmlAnchors,
    startOffset,
    endOffset
  });
  return { selected, startElement, endElement, left, right };
};

const applyTag = ({ tag, aHtmlElement }) => {
  const newAHtmlElement = { ...aHtmlElement };
  if (tag) {
    const toBeDeleted = newAHtmlElement.tags.find(
      ([tagName]) => tagName === tag
    );
    if (toBeDeleted) {
      const indexOfTagToBeDeleted = newAHtmlElement.tags.indexOf(toBeDeleted);
      newAHtmlElement.tags.splice(indexOfTagToBeDeleted, 1);
      // merge styles of the item to be deleted with the top-level tag tag
      newAHtmlElement.tags[0][1].style =
        toBeDeleted[1].style + newAHtmlElement.tags[0][1].style;
    } else {
      newAHtmlElement.tags.push([tag, {}]);
    }
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

const applyChangesToDom = ({
  startElement,
  endElement,
  left,
  right,
  selected
}) => {
  const leftElement = Element({ node: left });
  const rightElement = Element({ node: right });
  const selectedElement = Element({ node: selected });
  const startElementRoot = getParent({
    nestLevel: left.indexOfSelectionTarget_start,
    element: startElement
  });
  const endElementRoot = getParent({
    nestLevel: right.indexOfSelectionTarget_end,
    element: endElement
  });
  const newStartElement = toNodes(leftElement);
  const newSelectedElement = toNodes(selectedElement);
  const newEndElement = toNodes(rightElement);
  if (endElementRoot === startElementRoot) {
    startElementRoot.replaceWith(
      newStartElement,
      newSelectedElement,
      newEndElement
    );
  } else {
    startElementRoot.replaceWith(newStartElement, newSelectedElement);
    endElementRoot.replaceWith(newEndElement);
  }
};

const exekC = ({ tag }: { tag: string }) => {
  const {
    left,
    right,
    selected,
    startElement,
    endElement
  } = extractSelection();
  deleteTemporaryStamps(left);
  deleteTemporaryStamps(right);
  deleteTemporaryStamps(selected);
  const modifiedSelected = applyTag({ tag, aHtmlElement: selected });
  applyChangesToDom({
    startElement,
    endElement,
    left,
    selected: modifiedSelected,
    right
  });
};

export { exekC };
