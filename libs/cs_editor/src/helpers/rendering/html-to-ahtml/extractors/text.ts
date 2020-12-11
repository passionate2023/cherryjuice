import { flattenAHtml } from '::helpers/rendering/html-to-ahtml/steps/flatten-ahtml';

const extractText = (acc, el, commonAttributes, options) => {
  if (el.nodeType === Node.TEXT_NODE) {
    if (options.useObjForTextNodes) {
      acc.push({
        ...commonAttributes,
        _: el.wholeText,
      });
    } else {
      acc.push(el.wholeText);
    }
  } else {
    const { newAcc } = flattenAHtml({
      acc,
      aHtml: {
        _: el.textContent,
        ...commonAttributes,
      },
    });
    acc = newAcc;
  }
  return acc;
};

export { extractText };
