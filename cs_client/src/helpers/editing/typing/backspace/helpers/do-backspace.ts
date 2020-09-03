import { CustomRange } from '::helpers/editing/execK/steps/get-selection';

const codeBox = (selection: CustomRange): void => {
  const delimiterB = selection.endElement.parentElement;
  const codeBox = selection.startElement.parentElement.previousElementSibling;
  const delimiterA = codeBox.previousElementSibling
  delimiterA.remove();
  codeBox.remove();
  delimiterB.remove();
};
export const doBackspace = {
  codeBox,
};
