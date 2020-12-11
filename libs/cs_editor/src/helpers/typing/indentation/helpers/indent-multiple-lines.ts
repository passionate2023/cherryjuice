import {
  getAllElementsUntilElement,
  moveCursor,
} from '::helpers/execK/helpers';
import { addTabToStart } from '::helpers/typing/indentation/helpers/helpers/add-tab-to-start';
import { removeTabFromStart } from '::helpers/typing/indentation/helpers/helpers/remove-tab-from-start/remove-tab-from-start';
import { CustomRange } from '::helpers/execK/steps/get-selection';

export type IndentationContext = {
  startDDOE: HTMLElement;
  endDDOE: HTMLElement;
  positiveIndent: boolean;
};
export const indentMultipleLines = (
  { startElement, startOffset, endElement, endOffset }: CustomRange,
  { startDDOE, endDDOE, positiveIndent }: IndentationContext,
) => {
  const midDDOEs = [];
  getAllElementsUntilElement(midDDOEs, endDDOE, startDDOE);
  if (positiveIndent) {
    addTabToStart(startDDOE);
    midDDOEs.forEach(addTabToStart);
    addTabToStart(endDDOE);
  } else {
    const {
      removedCharactersLength: removedCharactersLengthFromStart,
    } = removeTabFromStart(startDDOE);
    midDDOEs.forEach(removeTabFromStart);
    const {
      removedCharactersLength: removedCharactersLengthFromEnd,
    } = removeTabFromStart(endDDOE);
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
