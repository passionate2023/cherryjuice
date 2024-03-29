import { applyCmd } from '::helpers/execK/steps/apply-command';
import { CustomRange, getSelection } from '::helpers/execK/steps/get-selection';
import { pipe1 } from '::helpers/execK/steps/pipe1';
import { pipe3 } from '::helpers/execK/steps/pipe3';
import { restoreSelection } from '::helpers/execK/steps/restore-selection';
import { ExecKCommand } from '::helpers/execK/execk-commands';
import { mergeSimilarNodes } from '::helpers/execK/steps/merge-similar-nodes/merge-similar-nodes';
import { bridge } from '::root/bridge';
import { FormattingError } from '::helpers/execK/helpers/errors';
import { getEditor } from '::helpers/pages-manager/helpers/get-editor';

const isJustificationCommand = command =>
  command && command != ExecKCommand.clear;

export type Attribute = [string, string];
export type ExecKMode = 'override' | 'toggle';
export type ExecKProps = {
  tagName?: string;
  attributes?: Attribute[];
  mode?: ExecKMode;
  style?: { property: string; value: string };
  command?: ExecKCommand;
  selection?: CustomRange;
};

const execK = ({
  tagName,
  attributes,
  mode = 'toggle',
  style,
  command,
  selection,
}: ExecKProps) => {
  const editor = getEditor();
  const ogHtml = editor.innerHTML;
  try {
    if (editor.contentEditable !== 'true' && !selection)
      throw new FormattingError('Editing is disabled');
    let { startElement, endElement, startOffset, endOffset } =
      selection || getSelection({ selectAdjacentWordIfNoneIsSelected: true });
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
    let { modifiedSelected, lineStyle } = applyCmd({
      selected,
      tagName,
      style,
      command,
      attributes,
      mode,
    });

    modifiedSelected = mergeSimilarNodes(modifiedSelected);
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
  } catch (e) {
    if (!selection) return;
    getEditor().innerHTML = ogHtml;
    // eslint-disable-next-line no-console
    if (process.env.NODE_ENV === 'development') console.error(e);
    bridge.current.onFormattingErrorHandler(e);
  }
};

export { execK };
