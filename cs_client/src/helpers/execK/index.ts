import { applyCmd } from '::helpers/execK/steps/apply-command';
import { getSelection } from '::helpers/execK/steps/get-selection';
import { pipe1 } from '::helpers/execK/steps//pipe1';
import { pipe3 } from '::helpers/execK/steps/pipe3';
import { restoreSelection } from '::helpers/execK/steps/restore-selection';

enum ExecKCommand {
  clear = 'clear',
  justifyLeft = 'left',
  justifyCenter = 'center',
  justifyRight = 'right',
}

const execK = (
  {
    tagName,
    style,
    command,
  }: {
    tagName?: string;
    style?: { property: string; value: string };
    command?: ExecKCommand;
  },
  testSample,
) => {
  const editor = document.querySelector('#rich-text ');
  const ogHtml = editor.innerHTML;
  try {
    let { startElement, endElement, startOffset, endOffset } =
      testSample || getSelection({ selectAdjacentWordIfNoneIsSelected: true });
    const {
      startAnchor,
      endAnchor,
      selected,
      left,
      right,
      startDDOE,
      endDDOE,
      adjustedSelection,
    } = pipe1({
      selectionStartElement: startElement,
      selectionEndElement: endElement,
      startOffset,
      endOffset,
    });
    startElement = adjustedSelection.selectionStartElement;
    endElement = adjustedSelection.selectionEndElement;
    const { modifiedSelected } = applyCmd({
      selected,
      tagName,
      style,
      command,
    });
    const {
      childrenElementsOfStartDDOE,
      childrenElementsOfEndDDOE,
      adjacentElementsOfStartDDOE,
    } = pipe3(
      { left, right, modifiedSelected },
      { startDDOE, endDDOE, endAnchor, startAnchor },
    );
    restoreSelection({
      modifiedSelection: {
        childrenElementsOfStartDDOE,
        childrenElementsOfEndDDOE,
        adjacentElementsOfStartDDOE,
      },
      selected,
      ogSelection: { startElement, endElement, startOffset, endOffset },
    });
  } catch (e) {
    document.querySelector('#rich-text ').innerHTML = ogHtml;
    throw e;
  }
};

export { execK };
export { ExecKCommand };
