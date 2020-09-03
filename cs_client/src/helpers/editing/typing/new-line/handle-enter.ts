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
  let nextSelectionElement;
  if (position.insideTable) return;
  if (position.insideCodeBox)
    nextSelectionElement = insertNewLine.insideCodeBox(selection);
  else if (position.beforeTable)
    nextSelectionElement = insertNewLine.beforeTable(selection);
  else nextSelectionElement = insertNewLine.generic(selection, position);
  setTextSelection(
    {
      startElement: nextSelectionElement,
      endElement: nextSelectionElement,
      startOffset: 0,
      endOffset: 0,
    },
    true,
  );
};
export { handleEnter };
