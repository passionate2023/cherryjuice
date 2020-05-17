import { getSelection } from '::helpers/editing/execK/steps/get-selection';
import { getDDOE } from '::helpers/editing/execK/steps/pipe1/ddoes';
import {
  getAllElementsUntilElement,
  moveCursor,
} from '::helpers/editing/execK/helpers';
import {
  addATabAfterCursor,
  addATabToTheStartOfTheLine,
  removeATabFromTheStartOfTheLine,
} from '::helpers/editing/typing/indentation/helpers';

const multiLineIndentation = ({
  startDDOE,
  endDDOE,
  positiveIndent,
  startElement,
  startOffset,
  endElement,
  endOffset,
}) => {
  const midDDOEs = [];
  getAllElementsUntilElement(midDDOEs, endDDOE, startDDOE);
  if (positiveIndent) {
    addATabToTheStartOfTheLine(startDDOE);
    midDDOEs.forEach(addATabToTheStartOfTheLine);
    addATabToTheStartOfTheLine(endDDOE);
  } else {
    const {
      removedCharactersLength: removedCharactersLengthFromStart,
    } = removeATabFromTheStartOfTheLine(startDDOE);
    midDDOEs.forEach(removeATabFromTheStartOfTheLine);
    const {
      removedCharactersLength: removedCharactersLengthFromEnd,
    } = removeATabFromTheStartOfTheLine(endDDOE);
    const newStartOffset = startOffset - removedCharactersLengthFromStart;
    const newEndOffset = endOffset - removedCharactersLengthFromEnd;
    moveCursor(
      {
        startElement: startElement,
        offset: newStartOffset > 0 ? newStartOffset : startOffset,
      },
      {
        endElement,
        endOffset: newEndOffset > 0 ? newEndOffset : endOffset,
      },
    );
  }
};
const singleLineIndentation = ({
  collapsed,
  positiveIndent,
  startElement,
  startOffset,
  endElement,
  endOffset,
}) => {
  if (collapsed) {
    if (positiveIndent) {
      addATabAfterCursor({ startElement, startOffset });
      moveCursor({ startElement: startElement, offset: startOffset + 4 });
    } else {
      const startDDOE = getDDOE(startElement);
      const { removedCharactersLength } = removeATabFromTheStartOfTheLine(
        startDDOE,
      );
      if (removedCharactersLength)
        moveCursor({ startElement: startElement, offset: startOffset - 4 });
    }
  } else {
    if (positiveIndent) {
      const startDDOE = getDDOE(startElement);
      addATabToTheStartOfTheLine(startDDOE);
    } else {
      const startDDOE = getDDOE(startElement);
      const { removedCharactersLength } = removeATabFromTheStartOfTheLine(
        startDDOE,
      );
      if (removedCharactersLength)
        moveCursor(
          { startElement: startElement, offset: startOffset - 4 },
          {
            endElement,
            endOffset: startElement === endElement ? endOffset - 4 : endOffset,
          },
        );
    }
  }
};
const handleIndentation = e => {
  e.preventDefault();
  const {
    collapsed,
    startElement,
    endElement,
    startOffset,
    endOffset,
  } = getSelection({
    selectAdjacentWordIfNoneIsSelected: false,
  });
  const startDDOE = getDDOE(startElement);
  const endDDOE = getDDOE(endElement);
  const selectionIsMultiline = !collapsed && startDDOE !== endDDOE;
  const positiveIndent = !e.shiftKey;
  if (selectionIsMultiline) {
    multiLineIndentation({
      endDDOE,
      endOffset,
      endElement,
      startElement,
      startDDOE,
      startOffset,
      positiveIndent,
    });
  } else
    singleLineIndentation({
      startElement,
      startOffset,
      endElement,
      endOffset,
      collapsed,
      positiveIndent,
    });
};

export { handleIndentation };
