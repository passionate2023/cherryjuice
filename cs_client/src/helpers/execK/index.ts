import { extractSelection } from '::helpers/execK/steps/extract-selection';
import { applyCommand } from '::helpers/execK/steps/apply-command';
import { applyChanges } from '::helpers/execK/steps/apply-changes';


const execK = ({ tagName, style }: { tagName?: string; style?: string }) => {
  const {
    left,
    right,
    selected,
    // midNodes,
    startElement,
    endElement
  } = extractSelection();

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
  applyChanges({ left, right, startElement, endElement, modifiedSelected });
};

export { execK };
