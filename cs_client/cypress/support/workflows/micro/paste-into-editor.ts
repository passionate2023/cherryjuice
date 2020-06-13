import { getTestCallbacks } from '../test-callbacks';
import { selectNode } from './select-node';
import { focusEditor } from './select-editor';
import { wait } from '../../helpers/cypress-helpers';
import { ImageAst } from '../../../fixtures/node/generate-node-content/image/generate-image';

type EventCreatorProps = {
  type: 'text/html' | 'text/plain' | 'Files';
  value: string | Blob;
};
const eventCreator = ({ type, value }: EventCreatorProps) => {
  const clipboardData = new DataTransfer();
  if (typeof value === 'string') clipboardData.setData(type, value);
  else {
    clipboardData.items.add(new File([value], (value as any).name));
  }
  const pasteEvent = new ClipboardEvent('paste', {
    bubbles: true,
    cancelable: true,
    clipboardData,
  });
  return pasteEvent;
};
type Cursor = {
  lineIndex: number;
  position: 'start';
};
const selectLine = ({ lineIndex }: Cursor) => {
  return cy.window().then(window => {
    const { document } = window;
    const range = document.createRange();
    range.setStart(document.querySelector('#rich-text').children[lineIndex], 0);
    range.collapse(true);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    wait.ms250();
  });
};
type PasteProps = {
  image?: ImageAst;
  pastedData?: EventCreatorProps;
  node: any;
  cursor: Cursor;
};
const pasteIntoEditor = ({
  pastedData,
  node,
  cursor,
  image,
}: PasteProps): void => {
  selectNode(node);
  focusEditor();
  selectLine(cursor);
  getTestCallbacks().then(tc => {
    if (image) {
      new Cypress.Promise(res => {
        image.getBlob(res);
      }).then((blob: Blob) => {
        const event = eventCreator({ type: 'Files', value: blob });
        tc.clipboard.onpaste(event);
      });
    } else {
      const event = eventCreator(pastedData);
      tc.clipboard.onpaste(event);
    }
  });
  wait.ms250();
};

export { pasteIntoEditor };
