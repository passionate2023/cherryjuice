import { trimOffset } from '::root/components/editor/helpers/execK/helpers';
import { smoothScrollIntoView } from '::root/components/app/components/editor/document/components/title-and-recent-nodes/components/components/tab';

const getDeepestFirstChild = (el: Element): Node | Element =>
  el?.firstChild
    ? getDeepestFirstChild((el.firstChild as unknown) as Element)
    : el;
const setTextSelection = (
  { startElement, endElement, startOffset, endOffset },
  collapsed?: boolean,
  scrollIntoSelection = true,
) => {
  const range = document.createRange();

  range.setStart(
    ...trimOffset(getDeepestFirstChild(startElement), startOffset),
  );
  if (collapsed) range.collapse(true);
  else if (endElement) {
    const deepestFirstChild = getDeepestFirstChild(endElement);
    range.setEnd(...trimOffset(deepestFirstChild, endOffset));
  }
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
  if (scrollIntoSelection) smoothScrollIntoView(startElement);
};
const getLength = (str: string, nextStr: string | undefined) =>
  Number(
    (/^(\s+|)$/.test(nextStr) || /^(\s+|)$/.test(str) ? str.trimEnd() : str)
      .length,
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
      absoluteOffset: [-1, -1],
    },
  );
const findNewRange = ({
  absoluteStartOffset,
  absoluteEndOffset,
  modifiedSelection,
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
      currentOffset: 0,
    },
  );

const isTextElement = el =>
  !['table', 'img'].includes(el.localName) &&
  !(el.localName === 'code' && el.classList.contains('rich-text__code')) &&
  el.innerText;
const isNotWhiteSpace = el => !/^\s+$/.test(el.innerText);

const restoreSelection = ({
  modifiedSelection: {
    childrenElementsOfStartDDOE,
    childrenElementsOfEndDDOE,
    adjacentElementsOfStartDDOE,
  },
  ogSelection,
  selected,
  options: { collapse },
}) => {
  const text = [
    {
      innerText: ogSelection.startElement.innerText,
      offset: ogSelection.startOffset,
    },
    ...selected.midNodes.map(node =>
      typeof node === 'string' ? node : node._ || '',
    ),
    {
      innerText: ogSelection.endElement.innerText,
      offset: ogSelection.endOffset,
    },
  ];
  const [absoluteStartOffset, absoluteEndOffset] =
    ogSelection.startElement === ogSelection.endElement
      ? [ogSelection.startOffset, ogSelection.endOffset]
      : findAbsoluteOffset(text).absoluteOffset;

  const a = childrenElementsOfStartDDOE.shift();
  const b = childrenElementsOfEndDDOE.pop();
  const m = [
    ...childrenElementsOfStartDDOE,
    ...adjacentElementsOfStartDDOE.flatMap(ddoe => Array.from(ddoe.childNodes)),
    ...childrenElementsOfEndDDOE,
  ]
    .flatMap(el => el)
    .filter(isTextElement)
    .filter(isNotWhiteSpace);
  const { startElement, endElement, startOffset, endOffset } = findNewRange({
    absoluteStartOffset,
    absoluteEndOffset,
    modifiedSelection: [a, ...m, b],
  });
  setTextSelection(
    startElement
      ? {
          startElement: startElement,
          endElement,
          startOffset,
          endOffset,
        }
      : ogSelection,
    collapse,
  );
};
export { restoreSelection, setTextSelection, getDeepestFirstChild };
