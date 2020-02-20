import { start } from 'repl';

const setSelection = ({ startElement, endElement, startOffset, endOffset }) => {
  const range = document.createRange();
  range.setStart(getDeepestChild(startElement), startOffset);
  range.setEnd(getDeepestChild(endElement), endOffset);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
};

const getInnerTextLength = el => (el.innerText ? el.innerText.length : 0);
const findAbsoluteOffset = xs =>
  xs.reduce(
    (acc, val) => {
      if (typeof val === 'string') {
        acc.tl += Number(val.length);
      } else {
        if (acc.absoluteOffset[0] === -1) {
          acc.absoluteOffset[0] = val[1] + acc.tl;
        } else if (acc.absoluteOffset[1] === -1) {
          acc.absoluteOffset[1] = val[1] + acc.tl;
        }
        acc.tl += Number(val[0].length);
      }
      return acc;
    },
    {
      tl: 0,
      absoluteOffset: [-1, -1]
    }
  );
const findNewRange = ({
  absoluteStartOffset,
  absoluteEndOffset,
  modifiedSelection
}) =>
  modifiedSelection.reduce(
    (acc, val) => {
      const elInnerTextLength = getInnerTextLength(val);
      if (
        !acc.startElement &&
        absoluteStartOffset < acc.currentOffset + elInnerTextLength
      ) {
        acc.startElement = val;
        acc.startOffset = absoluteStartOffset - acc.currentOffset;
      }
      if (
        !acc.endElement &&
        absoluteEndOffset <= acc.currentOffset + elInnerTextLength
      ) {
        acc.endElement = val;
        acc.endOffset = absoluteEndOffset - acc.currentOffset;
      }
      acc.currentOffset += elInnerTextLength;
      return acc;
    },
    {
      startElement: undefined,
      endElement: undefined,
      startOffset: -1,
      endOffset: -1,
      currentOffset: 0
    }
  );
const getDeepestChild = el =>
  el.firstChild ? getDeepestChild(el.firstChild) : el;
const restoreSelection = ({
  newStartElement,
  newEndElement,
  newSelectedElements,
  ogSelection,
  selected
}) => {
  const [absoluteStartOffset, absoluteEndOffset] =
    ogSelection.startElement === ogSelection.endElement
      ? [ogSelection.startOffset, ogSelection.endOffset]
      : findAbsoluteOffset([
          [ogSelection.startElement.innerText, ogSelection.startOffset],
          ...selected.midNodes.filter(node => node._).map(node => node._),
          [ogSelection.endElement.innerText, ogSelection.endOffset]
        ]).absoluteOffset;

  const { startElement, endElement, startOffset, endOffset } = findNewRange({
    absoluteStartOffset,
    absoluteEndOffset,
    modifiedSelection: [
      newStartElement,
      ...newSelectedElements.flatMap(el => el),
      newEndElement
    ]
  });
  setSelection({
    startElement,
    endElement,
    startOffset,
    endOffset
  });
};
export { restoreSelection, setSelection };
