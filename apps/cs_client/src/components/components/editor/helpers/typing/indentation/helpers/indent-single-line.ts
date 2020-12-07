import { moveCursor } from '::root/components/editor/helpers/execK/helpers';
import { addTabToEnd } from '::root/components/editor/helpers/typing/indentation/helpers/helpers/add-tab-to-end';
import { removeTabFromStart } from '::root/components/editor/helpers/typing/indentation/helpers/helpers/remove-tab-from-start/remove-tab-from-start';
import { addTabToStart } from '::root/components/editor/helpers/typing/indentation/helpers/helpers/add-tab-to-start';
import { CustomRange } from '::root/components/editor/helpers/execK/steps/get-selection';
import { IndentationContext } from '::root/components/editor/helpers/typing/indentation/helpers/indent-multiple-lines';

export const indentSingleLine = (
  { collapsed, startElement, startOffset, endElement, endOffset }: CustomRange,
  { positiveIndent, startDDOE }: IndentationContext,
) => {
  if (collapsed) {
    if (positiveIndent) {
      addTabToEnd({ startElement, startOffset });
      moveCursor({ startElement: startElement, offset: startOffset + 4 });
    } else {
      const tab = removeTabFromStart(startDDOE);
      if (tab.nextSelectedElement)
        moveCursor({
          startElement: tab.nextSelectedElement,
          offset: tab.nextSelectedElement.textContent.length,
        });
    }
  } else {
    if (positiveIndent) addTabToStart(startDDOE);
    else {
      const tab = removeTabFromStart(startDDOE);
      if (tab.removedCharactersLength)
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
