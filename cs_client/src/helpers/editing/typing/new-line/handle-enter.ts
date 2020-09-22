import { getSelection } from '::helpers/editing/execK/steps/get-selection';
import { setTextSelection } from '::helpers/editing/execK/steps/restore-selection';
import { insertNewLine } from '::helpers/editing/typing/new-line/helpers/insert-new-line';
import { getCursorPosition } from '::helpers/editing/typing/new-line/helpers/get-cursor-position';

const handleEnter = (e: KeyboardEvent) => {
  const selection = getSelection({
    selectAdjacentWordIfNoneIsSelected: false,
  });
  const position = getCursorPosition(selection);
  const preserveIndentation = !e.shiftKey;
  let nextSelectionElement;
  let offset = 0;
  if (position.insideTable) {
    e.preventDefault();
    return;
  }
  if (position.insideCodeBox) {
    return;
  } else if (position.beforeTable) {
    e.preventDefault();
    nextSelectionElement = insertNewLine.beforeTable(selection);
  } else {
    e.preventDefault();
    [nextSelectionElement, offset] = insertNewLine.generic(
      selection,
      position,
      preserveIndentation,
    );
  }
  setTextSelection(
    {
      startElement: nextSelectionElement,
      endElement: nextSelectionElement,
      startOffset: offset,
      endOffset: offset,
    },
    true,
  );
};
export { handleEnter };
