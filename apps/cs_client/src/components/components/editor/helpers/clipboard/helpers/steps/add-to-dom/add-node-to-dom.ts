import { getSelection } from '::editor/helpers/execK/steps/get-selection';
import { pipe1 } from '::editor/helpers/execK/steps/pipe1';
import {
  splitAHtmlsToMultipleLines,
  writeChangesToDom,
} from '::editor/helpers/execK/steps/pipe3';
import { getDDOE } from '::editor/helpers/execK/steps/pipe1/ddoes';
import { documentActionCreators } from '::root/components/app/components/editor/document/reducer/action-creators';
import { putCursorAtTheEndOfPastedElement } from '::editor/helpers/clipboard/helpers/steps/add-to-dom/helpers/put-cursor-at-the-end-of-pasted-element';

export type TAHtml =
  | { _: string; tags: [string, { [p: string]: string | object }][] }
  | { type: 'png'; outerHTML: string };

export const addNodeToDom = ({ pastedData }: { pastedData: TAHtml[] }) => {
  const ogHtml = document.querySelector('#rich-text ').innerHTML;
  try {
    const selection = getSelection({
      selectAdjacentWordIfNoneIsSelected: false,
    });
    const { startElement, endElement, startOffset, endOffset } = selection;
    let { startAnchor, endAnchor, left, right } = pipe1({
      selectionStartElement: startElement,
      selectionEndElement: endElement,
      startOffset,
      endOffset,
      stampPrefix: 'p',
    });

    const leftAHtmlsMultiLine = splitAHtmlsToMultipleLines({
      aHtmls: [left, ...pastedData],
    });
    const startDDOE = getDDOE(startAnchor);
    const endDDOE = getDDOE(endAnchor);
    const pastedDataIsMultiLine = leftAHtmlsMultiLine.length > 1;
    const startElementIsSameAsEndElement = startDDOE === endDDOE;
    if (startElementIsSameAsEndElement && pastedDataIsMultiLine) {
      const startDDOEShell = startDDOE.cloneNode();
      startDDOEShell.innerHTML = endAnchor.outerHTML;
      (endAnchor as Node).parentElement.removeChild(endAnchor);
      startDDOE.after(startDDOEShell);
      endAnchor = startDDOEShell.firstChild;
    }
    const { childrenElementsOfEndDDOE } = writeChangesToDom(
      {
        childrenOfStartDDDE: leftAHtmlsMultiLine.shift(),
        midDDOEs: leftAHtmlsMultiLine,
        childrenOfEndDDDE: [right],
      },
      { startAnchor, endAnchor },
    );

    putCursorAtTheEndOfPastedElement({
      newEndElement: childrenElementsOfEndDDOE[0],
    });
    if (pastedData.some(ahtml => (ahtml as any)?.type === 'png')) {
      documentActionCreators.pastedImages();
    }
  } catch (e) {
    document.querySelector('#rich-text ').innerHTML = ogHtml;
    throw e;
  }
};
