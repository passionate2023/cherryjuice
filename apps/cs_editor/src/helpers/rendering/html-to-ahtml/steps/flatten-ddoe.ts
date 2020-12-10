import { elementHasText } from '::helpers/execK/helpers';
import {
  getAttributes,
  isBlock,
} from '::helpers/rendering/html-to-ahtml/helpers/helpers';

const flattenDDOEs = ({ DDOEs }) => {
  const DDOEsChildren = [];
  const DDOEsAHtml = [];
  DDOEs.forEach(DDOE => {
    DDOEsAHtml.push({ tagName: DDOE.localName, ...getAttributes([])(DDOE) });
    if (isBlock(DDOE)) DDOEsChildren.push(document.createElement('br'));
    const DDOEHasNoTextAndHasOnlyABreakLine =
      DDOE.childNodes.length === 1 && !elementHasText(DDOE);
    if (!DDOEHasNoTextAndHasOnlyABreakLine)
      Array.from(DDOE.childNodes).forEach(child => {
        DDOEsChildren.push(child);
      });
  });
  return { DDOEsChildren, DDOEsAHtml };
};

export { flattenDDOEs };
