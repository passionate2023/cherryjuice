import { getCursorPosition } from '::helpers/editing/typing/new-line/helpers/get-cursor-position';
import { getSelection } from '::helpers/editing/execK/steps/get-selection';
import { doBackspace } from '::helpers/editing/typing/handle-backspace/helpers/do-backspace';
import { setTextSelection } from '::helpers/editing/execK/steps/restore-selection';

const handleBackSpace = e => {
  const selection = getSelection({
    selectAdjacentWordIfNoneIsSelected: false,
  });
  const position = getCursorPosition(selection);
  let nextSelectedElement;
  if (position.afterCodeBox) {
    e.preventDefault();
    nextSelectedElement = doBackspace.codeBox(selection);
  } else if (position.atStartOfDDOE) {
    e.preventDefault();
    nextSelectedElement = doBackspace.startOfDDOE(selection);
  }
  if (nextSelectedElement)
    setTextSelection(
      {
        startElement: nextSelectedElement,
        endElement: nextSelectedElement,
        startOffset: nextSelectedElement.textContent.length,
        endOffset: nextSelectedElement.textContent.length,
      },
      true,
    );
};
export { handleBackSpace };
