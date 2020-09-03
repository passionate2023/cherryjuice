import { CustomRange } from '::helpers/editing/execK/steps/get-selection';
import { getDDOE } from '::helpers/editing/execK/steps/pipe1/ddoes';

const startOfDDOE = (selection: CustomRange): Node => {
  const currentDDOE: HTMLElement = getDDOE(selection.startElement);
  const previousDDOE = currentDDOE.previousElementSibling;
  if (previousDDOE) {
    previousDDOE.append(...currentDDOE.childNodes);
    currentDDOE.remove();
    return previousDDOE.lastChild;
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
