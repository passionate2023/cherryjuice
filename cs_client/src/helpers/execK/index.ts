import { applyCmd } from '::helpers/execK/steps/apply-command';
import { getSelection } from '::helpers/execK/steps/get-selection';
import { pipe1 } from '::helpers/execK/steps//pipe1';
import { pipe3 } from '::helpers/execK/steps/pipe3';
import { restoreSelection } from '::helpers/execK/steps/restore-selection';
import { TDispatchAppReducer } from '::types/react';
import { appActions } from '::app/reducer';

enum ExecKCommand {
  clear = 'clear',
  justifyLeft = 'left',
  justifyCenter = 'center',
  justifyRight = 'right',
}

const execK = ({
  tagName,
  style,
  command,
  testSample,
  dispatch,
}: {
  tagName?: string;
  style?: { property: string; value: string };
  command?: ExecKCommand;
  testSample?: any;
  dispatch?: TDispatchAppReducer;
}) => {
  const editor: HTMLDivElement = document.querySelector('#rich-text ');
  const ogHtml = editor.innerHTML;
  try {
    if (editor.contentEditable !== 'true') throw Error('Editing is disabled');
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
    if (dispatch) {
      dispatch({ type: appActions.SET_ERROR, value: e });
    } else {
      throw e;
    }
  }
};

export { execK };
export { ExecKCommand };
