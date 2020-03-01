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

enum ExecKCommand {
  clear = 'clear',
  justifyLeft = 'left',
  justifyCenter = 'center',
  justifyRight = 'right'
}

const execK = ({
  tagName,
  style,
  command
}: {
  tagName?: string;
  style?: { property: string; value: string };
  command?: ExecKCommand;
}) => {
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

  const allTags = [
    ...selected.leftEdge.tags,
    ...selected.rightEdge.tags,
    ...selected.midNodes.flatMap(el => (typeof el === 'object' ? el.tags : []))
  ];
  const tagExists = tagName && allTags.some(([tag]) => tag === tagName);

  const styleExists =
    style?.property &&
    allTags.some(
      ([_, { style: existingStyle }]) =>
        existingStyle && existingStyle[style.property]?.includes(style.value)
    );
  const lineStyle = { line: {}, wrapper: {} };
  const modifiedSelected = {
    leftEdge: applyCommand({
      tag: { tagName, tagExists },
      style: { style, styleExists },
      aHtmlElement: selected.leftEdge,
      command,
      lineStyle
    }),
    rightEdge: applyCommand({
      tag: { tagName, tagExists },
      style: { style, styleExists },
      aHtmlElement: selected.rightEdge,
      command,
      lineStyle
    }),
    midNodes: selected.midNodes.map(el =>
      typeof el === 'object'
        ? applyCommand({
            tag: { tagName, tagExists },
            style: { style, styleExists },
            aHtmlElement: el,
            command,
            lineStyle
          })
        : el
    )
  };
  const { newStartElement, newSelectedElements, newEndElement } = applyChanges({
    left,
    right,
    startElement: correctedStartElement,
    endElement: correctedEndElement,
    modifiedSelected,
    lineStyle
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
export { ExecKCommand };
