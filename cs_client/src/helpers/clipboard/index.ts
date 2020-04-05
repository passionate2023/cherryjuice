import { getSelection } from '::helpers/execK/steps/get-selection';
import { setTextSelection } from '::helpers/execK/steps/restore-selection';
import { optimizeAHtml } from '::helpers/clipboard/optimize-ahtml';
import { getAHtml } from '::helpers/execK/helpers/html-to-ahtml';
import { pipe1 } from '::helpers/execK/steps/pipe1';
import {
  getInnerText,
  isElementNonTextual,
  moveCursor,
  toNodes,
} from '::helpers/execK/helpers';
import {
  splitAHtmlsToMultipleLines,
  writeChangesToDom,
} from '::helpers/execK/steps/pipe3';
import { getDDOE } from '::helpers/execK/steps/pipe1/ddoes';
import { appActionCreators } from '::app/reducer';

const getPngBase64 = file =>
  new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = event => {
      resolve(event.target.result);
    };
    reader.readAsDataURL(file);
  });

const cleanHtml = html => {
  if (html.startsWith('<HTML><HEAD></HEAD><BODY><!--StartFragment-->'))
    html = html.replace(
      /(<HTML><HEAD><\/HEAD><BODY><!--StartFragment-->|<!--EndFragment--><\/BODY><\/HTML>)/g,
      '',
    );
  return html;
};
const wrapNodeInSpan = (node: Text): Element => {
  const spanElement = document.createElement('span');
  spanElement.innerHTML = node.wholeText;
  return spanElement;
};
// :: clipData -> aHtml
type TAHtml =
  | { _: string; tags: [string, { [p: string]: string | object }][] }
  | { type: 'png'; outerHTML: string };
const processClipboard: { [p: string]: (str) => TAHtml[] } = {
  image: src => [
    {
      type: 'png',
      outerHTML: `<img src="${src}"/>`,
    },
  ],
  html: pastedData => {
    const node = new DOMParser().parseFromString(
      cleanHtml(pastedData),
      'text/html',
    ).body;
    const DDOEs = Array.from(node.childNodes).reduce((acc, child) => {
      const res =
        child.nodeType === Node.ELEMENT_NODE
          ? child
          : child.nodeType === Node.TEXT_NODE
          ? (child as Text).wholeText === '\n'
            ? acc.length
              ? toNodes(`<br>`)
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
      },
    });
    if (abstractHtml[0] === '\n') abstractHtml.shift();
    return optimizeAHtml({ aHtml: abstractHtml });
  },
  text: str => [{ _: str, tags: [['span', {}]] }],
};

const putCursorAtTheEndOfPastedElement = ({ newEndElement }) => {
  const elementIsNonTextual = isElementNonTextual(newEndElement);
  if (!elementIsNonTextual) {
    const innerText = getInnerText(newEndElement);
    setTextSelection(
      {
        startElement: newEndElement,
        endElement: newEndElement,
        startOffset: innerText.length,
        endOffset: innerText.length,
      },
      true,
    );
  } else {
    const parent = newEndElement.parentElement;
    const offset = Array.from(parent.childNodes).indexOf(newEndElement) + 1;
    moveCursor({ startElement: parent, offset });
  }
  const editableDiv = document.getElementById('rich-text');
  editableDiv.focus();
};

const addNodeToDom = ({ pastedData }: { pastedData: TAHtml[] }) => {
  const ogHtml = document.querySelector('#rich-text ').innerHTML;
  try {
    const selection = getSelection({
      selectAdjacentWordIfNoneIsSelected: false,
    });
    const { startElement, endElement, startOffset, endOffset } = selection;
    let { startAnchor, endAnchor, left, right } = pipe1({
      selectionStartElement: startElement,
      selectionEndElement: endElement,
      startOffset,
      endOffset,
    });

    const leftAHtmlsMultiLine = splitAHtmlsToMultipleLines({
      aHtmls: [left, ...pastedData],
    });
    const startDDOE = getDDOE(startAnchor);
    const endDDOE = getDDOE(endAnchor);
    const pastedDataIsMultiLine = leftAHtmlsMultiLine.length > 1;
    const startElementIsSameAsEndElement = startDDOE === endDDOE;
    if (startElementIsSameAsEndElement && pastedDataIsMultiLine) {
      const startDDOEShell = startDDOE.cloneNode();
      startDDOEShell.innerHTML = endAnchor.outerHTML;
      (endAnchor as Node).parentElement.removeChild(endAnchor);
      startDDOE.after(startDDOEShell);
      endAnchor = startDDOEShell.firstChild;
    }
    const { childrenElementsOfStartDDOE } = writeChangesToDom(
      {
        childrenOfStartDDDE: leftAHtmlsMultiLine.shift(),
        midDDOEs: leftAHtmlsMultiLine,
        childrenOfEndDDDE: [right],
      },
      { startAnchor, endAnchor },
    );

    const newEndElement =
      childrenElementsOfStartDDOE[childrenElementsOfStartDDOE.length - 1];
    putCursorAtTheEndOfPastedElement({
      newEndElement,
    });
  } catch (e) {
    document.querySelector('#rich-text ').innerHTML = ogHtml;
    throw e;
  }
};

const handlePaste = async e => {
  if (
    e &&
    e.clipboardData &&
    e.clipboardData.types &&
    e.clipboardData.getData
  ) {
    e.preventDefault();
    e.stopPropagation();
    const { clipboardData } = e;
    if (clipboardData.types.includes('Files')) {
      const file = clipboardData.files[0];
      const base64 = await getPngBase64(file);
      addNodeToDom({ pastedData: processClipboard.image(base64) });
    } else if (clipboardData.types.includes('text/html')) {
      const pastedData = e.clipboardData.getData('text/html');
      addNodeToDom({ pastedData: processClipboard.html(pastedData) });
    } else if (clipboardData.types.includes('text/plain')) {
      const pastedData = e.clipboardData.getData('text/plain');
      addNodeToDom({ pastedData: processClipboard.text(pastedData) });
    }
  }
};
const setupClipboard = () => {
  const editableDiv = document.getElementById('rich-text');
  editableDiv.onpaste = e => {
    handlePaste(e).catch(error => {
      // eslint-disable-next-line no-console
      if (process.env.NODE_ENV === 'development') console.error(error);
      appActionCreators.throwError(error);
    });
  };
};

export { setupClipboard };
