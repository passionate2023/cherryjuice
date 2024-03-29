import { CustomRange } from '::helpers/execK/steps/get-selection';
import { getDDOE } from '::helpers/execK/steps/pipe1/ddoes';
import { pipe1 } from '::helpers/execK/steps/pipe1';
import { writeChangesToDom } from '::helpers/execK/steps/pipe3';

const deleteSelection = (selection: CustomRange): void => {
  const { startAnchor, endAnchor, left, right } = pipe1({
    selectionStartElement: selection.startElement,
    selectionEndElement: selection.endElement,
    startOffset: selection.startOffset,
    endOffset: selection.endOffset,
    stampPrefix: 'p',
  });
  writeChangesToDom(
    {
      childrenOfStartDDDE: [left, right],
      childrenOfEndDDDE: [],
      midDDOEs: [],
    },
    { startAnchor, endAnchor },
  );
};

const startOfDDOE = (selection: CustomRange): Node => {
  const currentDDOE: HTMLElement = getDDOE(selection.startElement);
  const previousDDOE = currentDDOE.previousElementSibling;

  if (!selection.collapsed) deleteSelection(selection);

  if (previousDDOE) {
    const nextSelected = previousDDOE.lastChild;
    previousDDOE.append(...currentDDOE.childNodes);
    currentDDOE.remove();
    return nextSelected;
  }
};

const codeBox = (selection: CustomRange): Node => {
  const delimiterB = selection.endElement.parentElement;
  const codeBox = selection.startElement.parentElement.previousElementSibling;
  const delimiterA = codeBox.previousElementSibling;
  const nextSelectedElement = delimiterB.nextSibling;
  delimiterA.remove();
  codeBox.remove();
  delimiterB.remove();
  return nextSelectedElement;
};
export const doBackspace = {
  codeBox,
  startOfDDOE,
};
