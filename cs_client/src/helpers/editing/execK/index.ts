import { applyCmd } from '::helpers/editing/execK/steps/apply-command';
import { getSelection } from '::helpers/editing/execK/steps/get-selection';
import { pipe1 } from '::helpers/editing/execK/steps//pipe1';
import { pipe3 } from '::helpers/editing/execK/steps/pipe3';
import { restoreSelection } from '::helpers/editing/execK/steps/restore-selection';
import { AlertType } from '::types/react';
import { FormattingError } from '::types/errors';
import { ac } from '::store/store';
import { ExecKCommand } from '::helpers/editing/execK/execk-commands';
import { snapBackManager } from '::root/components/app/components/editor/tool-bar/components/groups/main-buttons/undo-redo/undo-redo';

const isJustificationCommand = command =>
  command && command != ExecKCommand.clear;

export type ExecKProps = {
  tagName?: string;
  style?: { property: string; value: string };
  command?: ExecKCommand;
};
const execK = ({
  tagName,
  style,
  command,
  testSample,
}: ExecKProps & { testSample?: any }) => {
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
    if (selectionContainsLinks) ac.node.processLinks(new Date().getTime());
  } catch (e) {
    snapBackManager.current.reset();
    document.querySelector('#rich-text ').innerHTML = ogHtml;
    snapBackManager.current.enable(1000);
    ac.dialogs.setSnackbar({
      lifeSpan: 2000,
      type: AlertType.Warning,
      message:
        e instanceof FormattingError
          ? e.message
          : 'Could not perform the action',
    });
  }
};

export { execK };
