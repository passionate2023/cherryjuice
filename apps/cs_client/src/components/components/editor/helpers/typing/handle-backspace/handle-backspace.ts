import { getCursorPosition } from '::root/components/editor/helpers/typing/new-line/helpers/get-cursor-position';
import { getSelection } from '::root/components/editor/helpers/execK/steps/get-selection';
import { doBackspace } from '::root/components/editor/helpers/typing/handle-backspace/helpers/do-backspace';
import { setTextSelection } from '::root/components/editor/helpers/execK/steps/restore-selection';

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
