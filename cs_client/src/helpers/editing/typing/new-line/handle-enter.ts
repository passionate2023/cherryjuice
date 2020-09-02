import { getDDOE } from '::helpers/editing/execK/steps/pipe1/ddoes';
import { getSelection } from '::helpers/editing/execK/steps/get-selection';
import { pipe1 } from '::helpers/editing/execK/steps/pipe1';
import { writeChangesToDom } from '::helpers/editing/execK/steps/pipe3';
import { setTextSelection } from '::helpers/editing/execK/steps/restore-selection';

const collectSiblings = (array: Node[] = []) => (node: Node): Node[] => {
  if (node?.nextSibling) {
    array.push(node.nextSibling);
    collectSiblings(array)(node.nextSibling);
  }
  return array;
};

const handleEnter = (e: KeyboardEvent) => {
  e.preventDefault();
  const selection = getSelection({
    selectAdjacentWordIfNoneIsSelected: false,
  });
  const { startElement, endElement, startOffset, endOffset } = selection;
  const splitSelection = pipe1({
    selectionStartElement: startElement,
    selectionEndElement: endElement,
    startOffset,
    endOffset,
    stampPrefix: 'p',
  });
  const siblings = collectSiblings()(splitSelection.endAnchor);
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
  setTextSelection(
    {
      startElement: firstElementOfNewLine,
      endElement: firstElementOfNewLine,
      startOffset: 0,
      endOffset: 0,
    },
    true,
  );
};
export { handleEnter };
