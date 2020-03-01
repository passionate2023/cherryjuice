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

export { applyCommand };
