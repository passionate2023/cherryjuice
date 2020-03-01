import { cloneObj } from '::helpers/execK/helpers';
import { applyStyle } from '::helpers/execK/steps/apply-command/apply-style';
import { applyTag } from '::helpers/execK/steps/apply-command/apply-tag';
import { removeFormatting } from '::helpers/execK/steps/apply-command/remove-formatting';

type TApplyCommand = {
  tag?: { tagName: string; tagExists: boolean };
  style?: { style: { property: string; value: string }; styleExists: boolean };
  aHtmlElement: any;
};
const applyCommand = ({
  tag: { tagName, tagExists },
  style: { style, styleExists },
  aHtmlElement
}: TApplyCommand) => {
  const newAHtmlElement = cloneObj(aHtmlElement);
  if (tagName === 'span') removeFormatting({ aHtmlElement: newAHtmlElement });
  if (tagName) {
    applyTag({ aHtmlElement: newAHtmlElement, tagExists, tagName });
  }
  if (style) {
    applyStyle({ aHtmlElement: newAHtmlElement, styleExists, style });
  }
  return newAHtmlElement;
};

export { applyCommand };
