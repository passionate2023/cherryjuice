import { pipe1 } from '::helpers/editing/execK/steps/pipe1';
import { CustomRange } from '::helpers/editing/execK/steps/get-selection';
import { writeChangesToDom } from '::helpers/editing/execK/steps/pipe3';
import { setTextSelection } from '::helpers/editing/execK/steps/restore-selection';
import { getEditor } from '::root/components/app/components/editor/document/components/rich-text/hooks/get-node-images';
import { newAnchorPrefix } from '::root/components/app/components/editor/document/components/rich-text/hooks/add-meta-to-pasted-images';

export const insertAnchor = (selection: CustomRange, anchorId: string) => {
  const anchorTs = `${newAnchorPrefix}${Date.now()}`;
  const editor = getEditor();
  const { startElement, endElement, startOffset, endOffset } = selection;
  const splitSelection = pipe1({
    selectionStartElement: startElement,
    selectionEndElement: endElement,
    startOffset,
    endOffset,
    stampPrefix: 'p',
  });

  const emptyAnchor = {
    type: 'png',
    outerHTML: `<img id="${anchorId}" data-ts="${anchorTs}" class="rich-text__anchor" src="/icons/cherrytree/anchor.svg" alt="icon">`,
  };
  writeChangesToDom(
    {
      childrenOfStartDDDE: [
        splitSelection.left,
        emptyAnchor,
        splitSelection.right,
      ],
      midDDOEs: [],
      childrenOfEndDDDE: [],
    },
    {
      startAnchor: splitSelection.startAnchor,
      endAnchor: splitSelection.endAnchor,
    },
    { filterEmptyNodes: false },
  );
  editor.focus();
  const anchor = document.querySelector(`[data-ts="${anchorTs}"]`);

  setTextSelection(
    {
      startElement: anchor.nextElementSibling || anchor,
      endElement: anchor.nextElementSibling || anchor,
      startOffset: 0,
      endOffset: 0,
    },
    true,
  );
  anchor.removeAttribute('data-ts');
};
