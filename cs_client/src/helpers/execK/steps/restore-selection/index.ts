const setSelection = ({ startElement, endElement, startOffset, endOffset }) => {
  const range = document.createRange();
  range.setStart(startElement, startOffset);
  range.setEnd(endElement, endOffset );
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
};

const getInnerTextLength = el => (el.innerText ? el.innerText.length : 0);
const findNewRange = ({ oldStartOffset, oldEndOffset, modifiedSelection }) =>
  modifiedSelection.reduce(
    (acc, val) => {
      const elInnerTextLength = getInnerTextLength(val);
      if (
        !acc.startElement &&
        oldStartOffset < acc.currentOffset + elInnerTextLength
      ) {
        acc.startElement = val;
        acc.startOffset = oldStartOffset - acc.currentOffset;
      }
      if (
        !acc.endElement &&
        oldEndOffset <= acc.currentOffset + elInnerTextLength
      ) {
        acc.endElement = val;
        acc.endOffset = oldEndOffset - acc.currentOffset;
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
  startOffset: oldStartOffset,
  endOffset: oldEndOffset
}) => {
  const { startElement, endElement, startOffset, endOffset } = findNewRange({
    oldStartOffset,
    oldEndOffset,
    modifiedSelection: [
      newStartElement,
      ...newSelectedElements.flatMap(el => el),
      newEndElement
    ]
  });
  setSelection({
    startElement: getDeepestChild(startElement),
    endElement: getDeepestChild(endElement),
    startOffset,
    endOffset
  });
};
export { restoreSelection };
