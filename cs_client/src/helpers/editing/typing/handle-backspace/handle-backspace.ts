import { getCursorPosition } from '::helpers/editing/typing/new-line/helpers/get-cursor-position';
import { getSelection } from '::helpers/editing/execK/steps/get-selection';
import { doBackspace } from '::helpers/editing/typing/handle-backspace/helpers/do-backspace';
import { setTextSelection } from '::helpers/editing/execK/steps/restore-selection';

const handleBackSpace = e => {
  const selection = getSelection({
    selectAdjacentWordIfNoneIsSelected: false,
  });
  const position = getCursorPosition(selection);
  let firstElementOfNewLine;
  if (position.afterCodeBox) {
    e.preventDefault();
    firstElementOfNewLine = doBackspace.codeBox(selection);
  } else if (position.atStartOfDDOE) {
    e.preventDefault();
    firstElementOfNewLine = doBackspace.startOfDDOE(selection);
  }
  if (firstElementOfNewLine)
    setTextSelection(
      {
        startElement: firstElementOfNewLine,
        endElement: firstElementOfNewLine,
        startOffset: firstElementOfNewLine.textContent.length,
        endOffset: firstElementOfNewLine.textContent.length,
      },
      true,
    );
};
export { handleBackSpace };
