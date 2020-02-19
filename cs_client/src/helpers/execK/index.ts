import { processSelection } from '::helpers/execK/steps/process-selection';
import { applyCommand } from '::helpers/execK/steps/apply-command';
import { applyChanges } from '::helpers/execK/steps/apply-changes';
import { getSelection } from '::helpers/execK/steps/get-selection';
import { restoreSelection } from '::helpers/execK/steps/restore-selection';

const execK = ({ tagName, style }: { tagName?: string; style?: string }) => {
  let { startElement, endElement, startOffset, endOffset } = getSelection();

  const { left, right, selected } = processSelection({
    startElement,
    endElement,
    startOffset,
    endOffset
  });

  const tagExists =
    tagName && selected.leftEdge.tags.some(([tag]) => tag === tagName);

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
    startElement,
    endElement,
    modifiedSelected
  });
  restoreSelection({ newStartElement, newSelectedElements, newEndElement ,startOffset, endOffset });
};

export { execK };
