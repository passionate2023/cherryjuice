import { cloneObj } from '::helpers/editing/execK/helpers';
import { applyStyle } from '::helpers/editing/execK/steps/apply-command/apply-style';
import { applyTag } from '::helpers/editing/execK/steps/apply-command/apply-tag';
import { removeFormatting } from '::helpers/editing/execK/steps/apply-command/remove-formatting';
import { ExecKCommand } from '::helpers/editing/execK';
import {
  justify,
  TLineStyle,
} from '::helpers/editing/execK/steps/apply-command/justify';
import { hoistAHtmlProperties } from '::helpers/editing/execK/steps/apply-command/hoist-properties';

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
  lineStyle,
}: TApplyCommand) => {
  let newAHtmlElement = cloneObj(aHtmlElement);
  if (command) {
    if (command === ExecKCommand.clear)
      removeFormatting({ aHtmlElement: newAHtmlElement, lineStyle });
    else justify({ aHtmlElement: newAHtmlElement, command, lineStyle });
  } else {
    if (tagName) {
      applyTag({ aHtmlElement: newAHtmlElement, tagExists, tagName });
    }
    if (style) {
      applyStyle({ aHtmlElement: newAHtmlElement, styleExists, style });
    }
    newAHtmlElement.tags = hoistAHtmlProperties({ tags: newAHtmlElement.tags });
  }
  return newAHtmlElement;
};
const applyCmd = ({ selected, tagName, style, command }) => {
  const allTags = [
    ...selected.leftEdge.tags,
    ...selected.rightEdge.tags,
    ...selected.midNodes.flatMap(el =>
      typeof el === 'object' && !el.type ? el.tags : [],
    ),
  ];
  const tagExists = tagName && allTags.some(([tag]) => tag === tagName);

  const styleExists =
    style?.property &&
    allTags.some(
      ([, { style: existingStyle }]) =>
        existingStyle && existingStyle[style.property]?.includes(style.value),
    );
  const lineStyle = { line: {}, deleteAll: false, delete: [] };
  const modifiedSelected = {
    leftEdge: applyCommand({
      tag: { tagName, tagExists },
      style: { style, styleExists },
      aHtmlElement: selected.leftEdge,
      command,
      lineStyle,
    }),
    rightEdge: applyCommand({
      tag: { tagName, tagExists },
      style: { style, styleExists },
      aHtmlElement: selected.rightEdge,
      command,
      lineStyle,
    }),
    midNodes: selected.midNodes.map(el =>
      typeof el === 'object'
        ? applyCommand({
            tag: { tagName, tagExists },
            style: { style, styleExists },
            aHtmlElement: el,
            command,
            lineStyle,
          })
        : el,
    ),
  };
  return { modifiedSelected, lineStyle };
};
export { applyCmd };
