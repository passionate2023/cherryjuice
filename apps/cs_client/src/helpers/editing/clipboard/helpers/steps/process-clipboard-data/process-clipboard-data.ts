// :: clipData -> aHtml
import { getAHtml } from '::helpers/rendering/html-to-ahtml';
import { stringToSingleElement } from '::helpers/editing/execK/helpers';
import { TAHtml } from '::helpers/editing/clipboard/helpers/steps/add-to-dom/add-node-to-dom';
import { unwrapHtml } from '::helpers/editing/clipboard/helpers/steps/process-clipboard-data/helpers/html/unwrap-html';
import { wrapNodeInSpan } from '::helpers/editing/clipboard/helpers/steps/process-clipboard-data/helpers/html/wrap-node-in-span';
import { optimizeAHtml } from '::helpers/editing/clipboard/helpers/steps/process-clipboard-data/helpers/html/optimize-a-html/optimize-a-html';
import { detectSources } from '::helpers/editing/clipboard/helpers/steps/process-clipboard-data/helpers/detect-sources';

export const processClipboard = {
  image: (src: string): TAHtml[] => [
    {
      type: 'png',
      outerHTML: `<img src="${src}"/>`,
    },
  ],
  html: (pastedData: string): TAHtml[] => {
    const singleLineFromWikipedia = detectSources.isSingleLineFromWikipedia(
      pastedData,
    );
    const node = new DOMParser().parseFromString(
      unwrapHtml(pastedData),
      'text/html',
    ).body;
    const DDOEs = Array.from(
      singleLineFromWikipedia ? [node] : node.childNodes,
    ).reduce((acc, child) => {
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
  text: (str: string): TAHtml[] => [{ _: str, tags: [['span', {}]] }],
};
