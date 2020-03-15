import { getSelection } from '::helpers/execK/steps/get-selection';
import { setTextSelection } from '::helpers/execK/steps/restore-selection';
import { optimizeAHtml } from '::helpers/clipboard/optimize-ahtml';
import { getAHtml } from '::helpers/execK/helpers/html-to-ahtml';
import { pipe1 } from '::helpers/execK/steps/pipe1';
import { toNodes } from '::helpers/execK/helpers';
import { aHtmlToElement } from '::helpers/execK/helpers/ahtml-to-html/element';
import { replaceElement } from '::helpers/execK/steps/pipe3/helpers';

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
            ? toNodes(`<br>`)
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
const nonTextualElements = ['img', 'table'];
const getInnerText = node => {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.wholeText;
  }
  if (node.nodeType === Node.ELEMENT_NODE) {
    return nonTextualElements.includes(node.localName) ? '' : node.innerText;
  }
  return '';
};
const putCursorAtTheEndOfPastedElement = ({ newEndElement }) => {
  const elementIsNonTextual = nonTextualElements.includes(
    newEndElement.localName,
  );
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
    const range = document.createRange();
    range.setStart(parent, offset);
    range.collapse(true);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
  const editableDiv = document.getElementById('rich-text');
  editableDiv.focus();
};

const addNodeToDom = ({ pastedData }: { pastedData: TAHtml[] }) => {
  const ogHtml = document.querySelector('#rich-text ').innerHTML;
  try {
    const range = document.getSelection().getRangeAt(0);
    const { startContainer, endContainer, startOffset, collapsed } = range;
    const pastingAtBeginningOfLine =
      startContainer === endContainer && startOffset === 0 && collapsed;
    let childrenElementsOfStartDDOE = [];
    if (pastingAtBeginningOfLine) {
      childrenElementsOfStartDDOE = [...pastedData].map(node =>
        toNodes(node === '\n' ? `<br>` : aHtmlToElement({ node })),
      );
      replaceElement(startContainer)(childrenElementsOfStartDDOE);
    } else {
      let { startElement, endElement, startOffset, endOffset } = getSelection({
        collapsed: true,
      });
      const { startAnchor, endAnchor, left, right } = pipe1({
        selectionStartElement: startElement,
        selectionEndElement: endElement,
        startOffset,
        endOffset,
      });
      childrenElementsOfStartDDOE = [
        left,
        // selected.leftEdge,
        ...pastedData,
      ].map(node => toNodes(node === '\n' ? `<br>` : aHtmlToElement({ node })));
      const childrenElementsOfEndDDOE = [right].map(node =>
        toNodes(aHtmlToElement({ node })),
      );

      replaceElement(startAnchor)(childrenElementsOfStartDDOE);
      replaceElement(endAnchor)(childrenElementsOfEndDDOE);
    }

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
      console.log(pastedData);
    }
  }
};
const setupClipboard = () => {
  const editableDiv = document.getElementById('rich-text');
  editableDiv.onpaste = handlePaste;
};

export { setupClipboard };
