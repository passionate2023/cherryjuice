import { getDDOE } from '::helpers/execK/steps/pipe1/ddoes';
import { setTextSelection } from '::helpers/execK/steps/restore-selection';
import { applyTemporaryStamps } from '::helpers/execK/steps/pipe1/split-selection';

export const putCursorAtEndOfLine = (line: HTMLElement) => {
  const lastChild = line.lastElementChild;
  if (lastChild) {
    setTextSelection({
      startElement: lastChild,
      endElement: lastChild,
      startOffset: lastChild.textContent.length,
      endOffset: lastChild.textContent.length,
    });
  } else
    setTextSelection({
      startElement: line,
      endElement: line,
      startOffset: 0,
      endOffset: 0,
    });
};

export const deleteLine = () => {
  const selection = document.getSelection().getRangeAt(0);
  if (selection) {
    const line: HTMLElement = getDDOE(selection.startContainer);
    if (line && line.classList.contains('rich-text__line')) {
      const previousLine = line.previousElementSibling as HTMLElement;
      const nextLine = line.nextElementSibling as HTMLElement;
      applyTemporaryStamps({
        startElement: line,
        endElement: line,
        stampPrefix: 'd',
        offset: selection.startOffset,
      });
      line.remove();
      if (previousLine) putCursorAtEndOfLine(previousLine);
      else if (nextLine) putCursorAtEndOfLine(nextLine);
    }
  }
};
