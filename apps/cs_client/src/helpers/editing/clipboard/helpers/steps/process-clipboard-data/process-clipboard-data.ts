// :: clipData -> aHtml
import { getAHtml } from '::helpers/rendering/html-to-ahtml';
import { stringToSingleElement } from '::helpers/editing/execK/helpers';
import { TAHtml } from '::helpers/editing/clipboard/helpers/steps/add-to-dom/add-node-to-dom';
import { unwrapHtml } from '::helpers/editing/clipboard/helpers/steps/process-clipboard-data/helpers/html/unwrap-html';
import { wrapNodeInSpan } from '::helpers/editing/clipboard/helpers/steps/process-clipboard-data/helpers/html/wrap-node-in-span';
import { optimizeAHtml } from '::helpers/editing/clipboard/helpers/steps/process-clipboard-data/helpers/html/optimize-a-html/optimize-a-html';

export const processClipboard: { [p: string]: (str) => TAHtml[] } = {
  image: src => [
    {
      type: 'png',
      outerHTML: `<img src="${src}"/>`,
    },
  ],
  html: pastedData => {
    const node = new DOMParser().parseFromString(
      unwrapHtml(pastedData),
      'text/html',
    ).body;
    const DDOEs = Array.from(node.childNodes).reduce((acc, child) => {
      const res =
        child.nodeType === Node.ELEMENT_NODE
          ? child
          : child.nodeType === Node.TEXT_NODE
          ? (child as Text).wholeText === '\n'
            ? acc.length
              ? stringToSingleElement(`<br>`)
              : undefined
            : wrapNodeInSpan(child as Text)
          : undefined;
      if (res) acc.push(res);
      return acc;
    }, []);
    const { abstractHtml } = getAHtml({
      DDOEs,
      options: {
        useObjForTextNodes: true,
        serializeNonTextElements: true,
        removeAttributes: true,
      },
    });
    if (abstractHtml[0] === '\n') abstractHtml.shift();
    return optimizeAHtml({ aHtml: abstractHtml });
  },
  text: str => [{ _: str, tags: [['span', {}]] }],
};
