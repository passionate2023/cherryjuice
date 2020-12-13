import { getDDOE } from '::helpers/execK/steps/pipe1/ddoes';
import {
  collectSiblings,
  getSpaceAtStart,
} from '::helpers/typing/new-line/helpers/shared';
import { CustomRange } from '::helpers/execK/steps/get-selection';
import { pipe1 } from '::helpers/execK/steps/pipe1';
import { writeChangesToDom } from '::helpers/execK/steps/pipe3';
import { CursorPosition } from '::helpers/typing/new-line/helpers/get-cursor-position';

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

const generic = (
  selection: CustomRange,
  position: CursorPosition,
  preserveIndentation: boolean,
): [Node, number] => {
  const { startElement, endElement, startOffset, endOffset } = selection;
  const spaceAtStart = getSpaceAtStart(getDDOE(startElement));
  const splitSelection = pipe1({
    selectionStartElement: startElement,
    selectionEndElement: endElement,
    startOffset,
    endOffset,
    stampPrefix: 's',
  });
  const siblings = collectSiblings()(splitSelection.endAnchor);
  if (position.beforeCodeBox)
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
  if (preserveIndentation && spaceAtStart) {
    const span = document.createElement('span');
    span.innerText = spaceAtStart;
    startDDOEShell.insertBefore(span, firstElementOfNewLine);
    return [span, spaceAtStart.length];
  } else return [firstElementOfNewLine, 0];
};

export const insertNewLine = {
  beforeTable,
  insideCodeBox,
  generic,
};
