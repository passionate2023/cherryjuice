import { getDDOE } from '::helpers/editing/execK/steps/pipe1/ddoes';
import { collectSiblings } from '::helpers/editing/typing/new-line/helpers/shared';
import { CustomRange } from '::helpers/editing/execK/steps/get-selection';
import { pipe1 } from '::helpers/editing/execK/steps/pipe1';
import { cursorIsAtBoxDelimiter } from '::helpers/editing/typing/backspace';
import { writeChangesToDom } from '::helpers/editing/execK/steps/pipe3';

const beforeTable = (selection: CustomRange): Node => {
  const siblings = collectSiblings()(selection.startElement);
  const startDDOE = getDDOE(selection.startElement);
  const startDDOEShell: HTMLSpanElement = startDDOE.cloneNode();
  startDDOE.after(startDDOEShell);
  startDDOEShell.append(
    document.createElement('span'),
    selection.startElement,
    ...siblings,
  );
  return startDDOEShell.firstChild;
};

const insideCodeBox = (selection: CustomRange): Node => {
  const right = selection.startElement.substringData(selection.startOffset, -1);
  selection.startElement.replaceData(selection.startOffset, -1, '');
  const newChild = document.createTextNode(right);
  selection.startElement.parentElement.appendChild(newChild);
  return newChild;
};

const generic = (selection: CustomRange): Node => {
  const { startElement, endElement, startOffset, endOffset } = selection;
  const splitSelection = pipe1({
    selectionStartElement: startElement,
    selectionEndElement: endElement,
    startOffset,
    endOffset,
    stampPrefix: 'p',
  });
  const siblings = collectSiblings()(splitSelection.endAnchor);
  const atBoxDelimiter = cursorIsAtBoxDelimiter(selection);
  if (atBoxDelimiter.isAtBoxDelimiter)
    siblings.unshift(splitSelection.adjustedSelection.selectionStartElement);
  const startDDOE = getDDOE(splitSelection.startAnchor);
  const startDDOEShell = startDDOE.cloneNode();
  startDDOEShell.innerHTML = splitSelection.endAnchor.outerHTML;
  (splitSelection.endAnchor as Node).parentElement.removeChild(
    splitSelection.endAnchor,
  );
  startDDOE.after(startDDOEShell);
  splitSelection.endAnchor = startDDOEShell.firstChild;
  const { childrenElementsOfEndDDOE } = writeChangesToDom(
    {
      childrenOfStartDDDE: [splitSelection.left],
      midDDOEs: [],
      childrenOfEndDDDE: [splitSelection.right],
    },
    {
      startAnchor: splitSelection.startAnchor,
      endAnchor: splitSelection.endAnchor,
    },
    { filterEmptyNodes: false },
  );
  const firstElementOfNewLine = childrenElementsOfEndDDOE[0];
  firstElementOfNewLine.after(...siblings);
  return firstElementOfNewLine;
};

export const insertNewLine = {
  beforeTable,
  insideCodeBox,
  generic,
};
