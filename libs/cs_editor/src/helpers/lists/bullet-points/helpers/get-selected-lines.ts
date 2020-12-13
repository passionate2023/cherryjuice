import { CustomRange } from '::helpers/execK/steps/get-selection';
import { getDDOE } from '::helpers/execK/steps/pipe1/ddoes';

export const getSelectedLines = (selection: CustomRange): Element[] => {
  const selectedLines = [];
  if (selection.startElement === selection.endElement) {
    selectedLines.push(getDDOE(selection.startElement));
  } else {
    const startLine: HTMLElement = getDDOE(selection.startElement);
    const endLine: HTMLElement = getDDOE(selection.endElement);
    selectedLines.push(startLine);
    let line: Element;
    line = startLine.nextElementSibling;
    while (line !== endLine) {
      selectedLines.push(line);
      line = line.nextElementSibling;
    }
    selectedLines.push(endLine);
  }
  return selectedLines;
};
