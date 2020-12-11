import { getSelection } from '::helpers/execK/steps/get-selection';
import { getDDOE } from '::helpers/execK/steps/pipe1/ddoes';
import { indentMultipleLines } from '::helpers/typing/indentation/helpers/indent-multiple-lines';
import { indentSingleLine } from '::helpers/typing/indentation/helpers/indent-single-line';

const handleTab = (e: KeyboardEvent) => {
  e.preventDefault();
  const selection = getSelection({
    selectAdjacentWordIfNoneIsSelected: false,
  });
  const startDDOE = getDDOE(selection.startElement);
  const endDDOE = getDDOE(selection.endElement);
  const selectionIsMultiline = !selection.collapsed && startDDOE !== endDDOE;
  const positiveIndent = !e.shiftKey;
  if (selectionIsMultiline)
    indentMultipleLines(selection, {
      endDDOE,
      startDDOE,
      positiveIndent,
    });
  else
    indentSingleLine(selection, {
      endDDOE,
      startDDOE,
      positiveIndent,
    });
};

export { handleTab };
