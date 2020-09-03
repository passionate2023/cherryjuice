import { setTextSelection } from '::helpers/editing/execK/steps/restore-selection';
import {
  guardAgainstEditorIsDDOE,
  guardAgainstEditorIsSelectionTarget,
  guardAgainstSelectionTargetIsImage,
} from '::helpers/editing/execK/steps/pipe1/guards';
import { FormattingError } from '::types/errors';

const getLineChildren = line => Array.from(line.childNodes);
const getRootParent = el =>
  el.parentElement.parentElement.getAttribute('id') === 'rich-text'
    ? el
    : getRootParent(el.parentElement);
const getLineDiv = el =>
  el.parentElement.parentElement.getAttribute('id') === 'rich-text'
    ? el.parentElement
    : getLineDiv(el.parentElement);
const mapNodesToText = xs =>
  xs.map(el =>
    el.nodeType === 1 ? el.innerText : el.nodeType === 3 ? el.wholeText : '',
  );
const mapTextToLength = xs => xs.map(str => str.length);
const findAnchors = ({ line, startOffset, endOffset }) => {
  return mapNodesToText(getLineChildren(line)).reduce(
    (acc, val, i) => {
      const l = val.length;
      if (startOffset < acc.tl + l && acc.s === -1) {
        acc.s = i;
        // acc.so = i > 0 ? acc.tl + l - startOffset : startOffset;
        acc.so = i > 0 ? startOffset - acc.tl : startOffset;
      }
      if (endOffset <= acc.tl + l && acc.e === -1) {
        acc.e = i;
        // acc.eo = acc.tl + l + 1 - endOffset;
        acc.eo = endOffset - acc.tl;
      }

      acc.tl += l;
      return acc;
    },
    {
      tl: 0,
      s: -1,
      e: -1,
      so: 0,
      eo: 0,
    },
  );
};

const createWordRange = ({ startElement, startOffset: caretOffset }) => {
  const line = getLineDiv(startElement);
  const lineChildren = getLineChildren(line);
  const text = line.innerText;
  const parentElement = getRootParent(startElement);
  const parentElementIndex = lineChildren.indexOf(parentElement);
  const containerOffset = mapTextToLength(mapNodesToText(lineChildren)).reduce(
    (acc, val, i) => (i < parentElementIndex ? acc + val : acc),
    0,
  );
  // @ts-ignore
  const lh = text.substring(0, containerOffset + caretOffset);
  // @ts-ignore
  const rh = text.substring(containerOffset + caretOffset);

  let lw: any = /\b[0-9_A-Za-z]+$/.exec(lh);
  let rw: any = /^[0-9_A-Za-z]+\b/.exec(rh);
  if (lw && !rw) rw = { 0: '', index: 0 };
  if (!lw && rw) lw = { 0: '', index: lh.length };
  if (!lw && !rw) throw new FormattingError('No adjacent word');

  const word = lw[0] + rw[0];
  const startOffset = lw['index'];
  const endOffset = startOffset + word.length;
  const { s, e, so, eo } = findAnchors({
    line,
    startOffset,
    endOffset,
  });

  return {
    startElement: line.childNodes[s],
    endElement: line.childNodes[e],
    startOffset: so, //startOffset - (s > 0 ? containerOffset : 0),
    endOffset: eo, //endOffset - containerOffset,
  };
};

export type CustomRange = {
  endOffset: number;
  endElement: Text;
  startOffset: number;
  startElement: Text;
  collapsed: boolean;
};

type GetSelection = ({
  selectAdjacentWordIfNoneIsSelected,
}: {
  selectAdjacentWordIfNoneIsSelected?: boolean;
}) => CustomRange;

const getSelection: GetSelection = ({ selectAdjacentWordIfNoneIsSelected }={}) => {
  const selection = document.getSelection();
  if (selection.rangeCount === 0)
    throw new FormattingError('Could not find the cursor');
  const {
    startContainer,
    endContainer,
    startOffset,
    endOffset,
    collapsed,
  } = selection.getRangeAt(0);

  const adjustedSelection = guardAgainstEditorIsDDOE(
    guardAgainstSelectionTargetIsImage(
      guardAgainstEditorIsSelectionTarget({
        selectionStartElement: startContainer,
        selectionEndElement: endContainer,
        startOffset,
        endOffset,
      }),
    ),
  );

  if (selection.getRangeAt(0).collapsed && selectAdjacentWordIfNoneIsSelected) {
    setTextSelection(
      createWordRange({
        startElement: adjustedSelection.selectionStartElement,
        startOffset: adjustedSelection.startOffset,
      }),
    );
    const range = document.getSelection().getRangeAt(0);
    return {
      startElement: range.startContainer,
      endElement: range.endContainer,
      startOffset: range.startOffset,
      endOffset: range.endOffset,
      collapsed: range.collapsed,
    };
  } else
    return {
      startElement: adjustedSelection.selectionStartElement,
      endElement: adjustedSelection.selectionEndElement,
      startOffset: adjustedSelection.startOffset,
      endOffset: adjustedSelection.endOffset,
      collapsed,
    };
};

export { getSelection, getRootParent, getLineChildren };
