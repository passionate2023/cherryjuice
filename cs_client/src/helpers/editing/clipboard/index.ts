import { getSelection } from '::helpers/editing/execK/steps/get-selection';
import { setTextSelection } from '::helpers/editing/execK/steps/restore-selection';
import { optimizeAHtml } from '::helpers/editing/clipboard/optimize-ahtml';
import { getAHtml } from '::helpers/rendering/html-to-ahtml';
import { pipe1 } from '::helpers/editing/execK/steps/pipe1';
import {
  isElementNonTextual,
  moveCursor,
  stringToSingleElement,
} from '::helpers/editing/execK/helpers';
import {
  splitAHtmlsToMultipleLines,
  writeChangesToDom,
} from '::helpers/editing/execK/steps/pipe3';
import { getDDOE } from '::helpers/editing/execK/steps/pipe1/ddoes';
import { AlertType } from '::types/react';
import { documentActionCreators } from '::root/components/app/components/editor/document/reducer/action-creators';
import { isValidUrl, isNotPngBase64 } from '::helpers/misc';
import { ac } from '::store/store';

const blobToBase64 = (file: Blob): Promise<string> =>
  new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = event => {
      resolve(event.target.result as string);
    };
    reader.readAsDataURL(file);
  });
const urlToBase64 = (url: string): Promise<string> =>
  fetch(url)
    .then(res => res.blob())
    .then(blobToBase64);

const anyImageBase64ToPngBase64 = (image: HTMLImageElement): string => {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, image.width, image.height);
  return canvas.toDataURL('image/png');
};
const attachWidthAndHeight = (image: HTMLImageElement) => () => {
  const { width, height } = image;
  if (width) image.style.width = `${width}px`;
  if (height) image.style.height = `${height}px`;
};
const replaceImageUrlWithBase64 = async (
  image: HTMLImageElement,
): Promise<void> => {
  if (isValidUrl(image.src)) {
    image.src = await urlToBase64(image.src);
  }
  await new Promise(res => {
    image.onload = () => {
      attachWidthAndHeight(image)();
      if (isNotPngBase64(image)) {
        image.src = anyImageBase64ToPngBase64(image);
      }
      res();
    };
  });
};
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

const putCursorAtTheEndOfPastedElement = ({ newEndElement }) => {
  const elementIsNonTextual = isElementNonTextual(newEndElement);
  if (!elementIsNonTextual) {
    setTextSelection(
      {
        startElement: newEndElement,
        endElement: newEndElement,
        startOffset: 0,
        endOffset: 0,
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
      stampPrefix: 'p',
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
    const { childrenElementsOfEndDDOE } = writeChangesToDom(
      {
        childrenOfStartDDDE: leftAHtmlsMultiLine.shift(),
        midDDOEs: leftAHtmlsMultiLine,
        childrenOfEndDDDE: [right],
      },
      { startAnchor, endAnchor },
    );

    putCursorAtTheEndOfPastedElement({
      newEndElement: childrenElementsOfEndDDOE[0],
    });
    if (pastedData.some(ahtml => (ahtml as any)?.type === 'png')) {
      documentActionCreators.pastedImages();
    }
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
      const base64 = await blobToBase64(file);
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
const onpaste = e => {
  handlePaste(e).catch(error => {
    ac.dialogs.setAlert({
      title: 'Could not perform the paste',
      description: 'Please submit a bug report',
      error,
      type: AlertType.Error,
    });
  });
};
const setupClipboard = () => {
  const editableDiv = document.getElementById('rich-text');
  editableDiv.onpaste = onpaste;
};

export {
  setupClipboard,
  replaceImageUrlWithBase64,
  anyImageBase64ToPngBase64,
  onpaste,
};
