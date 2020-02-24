import { processSelection } from '::helpers/execK/steps/process-selection';
import { applyCommand } from '::helpers/execK/steps/apply-command';
import { applyChanges } from '::helpers/execK/steps/apply-changes';
import {
  createWordRange,
  getSelection
} from '::helpers/execK/steps/get-selection';
import {
  restoreSelection,
  setSelection
} from '::helpers/execK/steps/restore-selection';

const execK = ({ tagName, style }: { tagName?: string; style?: string }) => {
  const selection = document.getSelection();
  if (selection.rangeCount === 0) return;
  const range = selection.getRangeAt(0);
  if (range.collapsed) setSelection(createWordRange());

  let { startElement, endElement, startOffset, endOffset } = getSelection();

  const {
    left,
    right,
    selected,
    correctedStartElement,
    correctedEndElement
  } = processSelection({
    startElement,
    endElement,
    startOffset,
    endOffset
  });

  const tagExists =
    tagName &&
    [
      ...selected.leftEdge.tags,
      ...selected.rightEdge.tags,
      ...selected.midNodes.flatMap(el =>
        typeof el === 'object' ? el.tags : []
      )
    ].some(([tag]) => tag === tagName);

  const styleExists =
    style &&
    selected.leftEdge.tags.some(
      ([_, { style: existingStyle }]) =>
        existingStyle && existingStyle.includes(style)
    );
  const modifiedSelected = {
    leftEdge: applyCommand({
      tag: { tagName, tagExists },
      style: { style, styleExists },
      aHtmlElement: selected.leftEdge
    }),
    rightEdge: applyCommand({
      tag: { tagName, tagExists },
      style: { style, styleExists },
      aHtmlElement: selected.rightEdge
    }),
    midNodes: selected.midNodes.map(el =>
      typeof el === 'object'
        ? applyCommand({
            tag: { tagName, tagExists },
            style: { style, styleExists },
            aHtmlElement: el
          })
        : el
    )
  };
  const { newStartElement, newSelectedElements, newEndElement } = applyChanges({
    left,
    right,
    startElement: correctedStartElement,
    endElement: correctedEndElement,
    modifiedSelected
  });

  restoreSelection({
    newStartElement,
    newSelectedElements,
    newEndElement,
    selected,
    ogSelection: {
      startElement: correctedStartElement,
      endElement: correctedEndElement,
      startOffset,
      endOffset
    }
  });
};

export { execK };
