import { getSelection } from '::helpers/editing/execK/steps/get-selection';
import { setTextSelection } from '::helpers/editing/execK/steps/restore-selection';
import { insertNewLine } from '::helpers/editing/typing/new-line/helpers/insert-new-line';
import { getCursorPosition } from '::helpers/editing/typing/new-line/helpers/get-cursor-position';

const handleEnter = (e: KeyboardEvent) => {
  e.preventDefault();
  const selection = getSelection({
    selectAdjacentWordIfNoneIsSelected: false,
  });
  const position = getCursorPosition(selection);
  const preserveIndentation = !e.shiftKey;
  let nextSelectionElement;
  let offset = 0;
  if (position.insideTable) return;
  if (position.insideCodeBox)
    nextSelectionElement = insertNewLine.insideCodeBox(selection);
  else if (position.beforeTable)
    nextSelectionElement = insertNewLine.beforeTable(selection);
  else
    [nextSelectionElement, offset] = insertNewLine.generic(
      selection,
      position,
      preserveIndentation,
    );
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
