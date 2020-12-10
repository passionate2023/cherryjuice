import { getSelection } from '::helpers/execK/steps/get-selection';
import { pipe1 } from '::helpers/execK/steps/pipe1';
import {
  splitAHtmlsToMultipleLines,
  writeChangesToDom,
} from '::helpers/execK/steps/pipe3';
import { getDDOE } from '::helpers/execK/steps/pipe1/ddoes';
import { putCursorAtTheEndOfPastedElement } from '::helpers/clipboard/helpers/steps/add-to-dom/helpers/put-cursor-at-the-end-of-pasted-element';
import { addMetaToPastedImages } from '::helpers/clipboard/helpers/steps/add-to-dom/helpers/add-meta-to-pasted-images';

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
      addMetaToPastedImages();
    }
  } catch (e) {
    document.querySelector('#rich-text ').innerHTML = ogHtml;
    throw e;
  }
};
