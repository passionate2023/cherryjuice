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
  let firstElementOfNewLine;
  if (position.insideTable) return;
  if (position.insideCodeBox)
    firstElementOfNewLine = insertNewLine.insideCodeBox(selection);
  else if (position.beforeTable)
    firstElementOfNewLine = insertNewLine.beforeTable(selection);
  else firstElementOfNewLine = insertNewLine.generic(selection, position);
  setTextSelection(
    {
      startElement: firstElementOfNewLine,
      endElement: firstElementOfNewLine,
      startOffset: 0,
      endOffset: 0,
    },
    true,
  );
};
export { handleEnter };
