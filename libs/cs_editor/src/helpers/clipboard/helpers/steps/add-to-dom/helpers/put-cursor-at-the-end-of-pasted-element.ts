import { isElementNonTextual, moveCursor } from '::helpers/execK/helpers';
import { setTextSelection } from '::helpers/execK/steps/restore-selection';

export const putCursorAtTheEndOfPastedElement = ({ newEndElement }) => {
  const elementIsNonTextual = isElementNonTextual(newEndElement);
  if (!elementIsNonTextual) {
    setTextSelection(
      {
        startElement: newEndElement,
        endElement: newEndElement,
        startOffset: 0,
        endOffset: 0,
      },
      true,
    );
  } else {
    const parent = newEndElement.parentElement;
    const offset = Array.from(parent.childNodes).indexOf(newEndElement) + 1;
    moveCursor({ startElement: parent, offset });
  }
  const editableDiv = document.getElementById('rich-text');
  editableDiv.focus();
};
