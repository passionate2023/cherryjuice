import { getTestCallbacks } from '../test-callbacks';
import { selectNode } from './select-node';
import { focusEditor } from './select-editor';
import { wait } from '../../helpers/cypress-helpers';

type EventCreatorProps = {
  type: 'text/html' | 'text/plain';
  value: string;
};
const eventCreator = ({ type, value }: EventCreatorProps) => {
  const clipboardData = new DataTransfer();
  clipboardData.setData(type, value);
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
  pastedData: EventCreatorProps;
  node: any;
  cursor: Cursor;
};
const pasteIntoEditor = ({ pastedData, node, cursor }: PasteProps): void => {
  selectNode(node);
  focusEditor();
  selectLine(cursor);
  getTestCallbacks().then(tc => {
    const event = eventCreator(pastedData);
    tc.clipboard.onpaste(event);
  });
  wait.ms250();
};

export { pasteIntoEditor };
