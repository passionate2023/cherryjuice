import { start } from 'repl';

const setSelection = ({ startElement, endElement, startOffset, endOffset }) => {
  const range = document.createRange();
  range.setStart(getDeepestChild(startElement), startOffset);
  range.setEnd(getDeepestChild(endElement), endOffset);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
};
const getLength = (str: string, nextStr: string | undefined) =>
  Number(
    (/^(\s+|)$/.test(nextStr) || /^(\s+|)$/.test(str) ? str.trimEnd() : str).length
  );
const getInnerTextLength = el => (el.innerText ? el.innerText.length : 0);
const findAbsoluteOffset = xs =>
  xs.reduce(
    (acc, val, i, arr) => {
      if (typeof val === 'string') {
        acc.tl += getLength(val, arr[i + 1]);
      } else {
        if (acc.absoluteOffset[0] === -1) {
          acc.absoluteOffset[0] = val.offset + acc.tl;
        } else if (acc.absoluteOffset[1] === -1) {
          acc.absoluteOffset[1] = val.offset + acc.tl;
        }
        acc.tl += getLength(val.innerText, arr[i + 1]);
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

const isTextElement = el =>
  !['table', 'img', 'code'].includes(el.localName) && el.innerText;
const isNotWhiteSpace = el => !/^\s+$/.test(el.innerText);
const restoreSelection = ({
  newStartElement,
  newEndElement,
  newSelectedElements,
  ogSelection,
  selected
}) => {
  const text = [
    {
      innerText: ogSelection.startElement.innerText,
      offset: ogSelection.startOffset
    },
    ...selected.midNodes.map(node =>
      typeof node === 'string' ? node : node._ || ''
    ),
    {
      innerText: ogSelection.endElement.innerText,
      offset: ogSelection.endOffset
    }
  ];
  const [absoluteStartOffset, absoluteEndOffset] =
    ogSelection.startElement === ogSelection.endElement
      ? [ogSelection.startOffset, ogSelection.endOffset]
      : findAbsoluteOffset(text).absoluteOffset;

  const { startElement, endElement, startOffset, endOffset } = findNewRange({
    absoluteStartOffset,
    absoluteEndOffset,
    modifiedSelection: [
      newStartElement,
      ...newSelectedElements
        .flatMap(el => el)
        .filter(isTextElement)
        .filter(isNotWhiteSpace),
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
