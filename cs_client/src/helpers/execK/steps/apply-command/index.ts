import { cloneObj } from '::helpers/execK/helpers';
import { applyStyle } from '::helpers/execK/steps/apply-command/apply-style';
import { applyTag } from '::helpers/execK/steps/apply-command/apply-tag';
import { removeFormatting } from '::helpers/execK/steps/apply-command/remove-formatting';
import { ExecKCommand } from '::helpers/execK';
import {
  justify,
  TLineStyle
} from '::helpers/execK/steps/apply-command/justify';

type TApplyCommand = {
  tag?: { tagName: string; tagExists: boolean };
  style?: { style: { property: string; value: string }; styleExists: boolean };
  aHtmlElement: any;
  command: ExecKCommand;
  lineStyle: TLineStyle;
};
const applyCommand = ({
  tag: { tagName, tagExists },
  style: { style, styleExists },
  aHtmlElement,
  command,
  lineStyle
}: TApplyCommand) => {
  const newAHtmlElement = cloneObj(aHtmlElement);
  if (command) {
    if (command === ExecKCommand.clear)
      removeFormatting({ aHtmlElement: newAHtmlElement });
    else justify({ aHtmlElement: newAHtmlElement, command, lineStyle });
  } else {
    if (tagName) {
      applyTag({ aHtmlElement: newAHtmlElement, tagExists, tagName });
    }
    if (style) {
      applyStyle({ aHtmlElement: newAHtmlElement, styleExists, style });
    }
  }
  return newAHtmlElement;
};
const applyCmd = ({ selected, tagName, style, command }) => {
  const allTags = [
    ...selected.leftEdge.tags,
    ...selected.rightEdge.tags,
    ...selected.midNodes.flatMap(el =>
      typeof el === 'object' && !el.type ? el.tags : []
    )
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
  return { modifiedSelected };
};
export { applyCmd };
