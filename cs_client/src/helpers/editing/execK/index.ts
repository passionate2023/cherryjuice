import { applyCmd } from '::helpers/editing/execK/steps/apply-command';
import { getSelection } from '::helpers/editing/execK/steps/get-selection';
import { pipe1 } from '::helpers/editing/execK/steps//pipe1';
import { pipe3 } from '::helpers/editing/execK/steps/pipe3';
import { restoreSelection } from '::helpers/editing/execK/steps/restore-selection';
import { appActionCreators } from '::app/reducer';
import { AlertType } from '::types/react';
import { FormattingError } from '::types/errors';

enum ExecKCommand {
  clear = 'clear',
  justifyLeft = 'left',
  justifyFill = 'fill',
  justifyCenter = 'center',
  justifyRight = 'right',
}
const isJustificationCommand = command =>
  command && command != ExecKCommand.clear;

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
      throw new FormattingError('Editing is disabled');
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
      selectionContainsLinks,
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
        options: { collapse: isJustificationCommand(command) },
      });
      if (selectionContainsLinks)
        appActionCreators.processLinks(new Date().getTime());
    }
  } catch (e) {
    document.querySelector('#rich-text ').innerHTML = ogHtml;
    appActionCreators.setAlert({
      title: 'Could not apply formatting',
      description:
        e instanceof FormattingError ? e.message : 'Please submit a bug report',
      type: AlertType.Error,
      error: e,
    });
  }
};

export { execK };
export { ExecKCommand };
