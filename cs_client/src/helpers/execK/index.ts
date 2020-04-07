import { applyCmd } from '::helpers/execK/steps/apply-command';
import { getSelection } from '::helpers/execK/steps/get-selection';
import { pipe1 } from '::helpers/execK/steps//pipe1';
import { pipe3 } from '::helpers/execK/steps/pipe3';
import {
  restoreSelection,
} from '::helpers/execK/steps/restore-selection';
import { appActionCreators } from '::app/reducer';

enum ExecKCommand {
  clear = 'clear',
  justifyLeft = 'left',
  justifyFill = 'fill',
  justifyCenter = 'center',
  justifyRight = 'right',
}
const isJustificationCommand = command =>
  command && command != ExecKCommand.clear

const execK = ({
  tagName,
  style,
  command,
  testSample,
}: {
  tagName?: string;
  style?: { property: string; value: string };
  command?: ExecKCommand;
  testSample?: any;
}) => {
  const editor: HTMLDivElement = document.querySelector('#rich-text ');
  const ogHtml = editor.innerHTML;
  try {
    if (editor.contentEditable !== 'true' && !testSample)
      throw Error('Editing is disabled');
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
    const { modifiedSelected, lineStyle } = applyCmd({
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
      { left, right, modifiedSelected, lineStyle },
      { startDDOE, endDDOE, endAnchor, startAnchor },
    );
    {
      restoreSelection({
        modifiedSelection: {
          childrenElementsOfStartDDOE,
          childrenElementsOfEndDDOE,
          adjacentElementsOfStartDDOE,
        },
        selected,
        ogSelection: { startElement, endElement, startOffset, endOffset },
        options:{collapse:isJustificationCommand(command) }
      });
    }
  } catch (e) {
    document.querySelector('#rich-text ').innerHTML = ogHtml;
    appActionCreators.throwError(e);
    // eslint-disable-next-line no-console
    if (process.env.NODE_ENV === 'development') console.error(e);
  }
};

export { execK };
export { ExecKCommand };
