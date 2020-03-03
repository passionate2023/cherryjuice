import { getSelection } from '::helpers/execK/steps/get-selection';
import {
  splitSelectionIntoThree
} from '::helpers/execK/steps/split-selection';
import { applyChanges } from '::helpers/execK/steps/apply-changes';
import { setSelection } from '::helpers/execK/steps/restore-selection';

const getPngBase64 = file =>
  new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = event => {
      resolve(event.target.result);
    };
    reader.readAsDataURL(file);
  });

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
      console.log(pastedData);
    } else if (clipboardData.types.includes('text/plain')) {
      const pastedData = e.clipboardData.getData('text/plain');
      addNodeToDom({ pastedData: processClipboard.text(pastedData) });
      console.log(pastedData);
    }
  }
};

// :: clipData -> aHtml
type TAHtml =
  | { _: string; tags: [string, { [p: string]: string | object }][] }
  | { type: 'png'; outerHTML: string };
const processClipboard: { [p: string]: (str) => TAHtml } = {
  image: src => ({
    type: 'png',
    outerHTML: `<img src="${src}"/>`
  }),
  html: str => ({}),
  text: str => ({ _: str, tags: [['span', {}]] })
};

const putCursorAtTheEndOfPastedElement = ({ newEndElement }) => {
  setSelection(
    {
      startElement: newEndElement,
      endElement: newEndElement,
      startOffset: 0,
      endOffset: 0
    },
    true
  );
  const editableDiv = document.getElementById('rich-text');
  editableDiv.focus();
};

const addNodeToDom = ({ pastedData }: { pastedData: TAHtml }) => {
  let { startElement, endElement, startOffset, endOffset } = getSelection({
    collapsed: true
  });

  const { left, right } = splitSelectionIntoThree({
    startElement,
    endElement,
    startOffset,
    endOffset
  });

  const { newEndElement } = applyChanges({
    left,
    right,
    startElement,
    endElement,
    modifiedSelected: {
      leftEdge: pastedData,
      rightEdge: { _: '', tags: [] },
      midNodes: []
    },
    lineStyle: { line: {} }
  });
  putCursorAtTheEndOfPastedElement({ newEndElement });
};

const setupClipboard = () => {
  const editableDiv = document.getElementById('rich-text');
  editableDiv.onpaste = handlePaste;
};

export { setupClipboard };
