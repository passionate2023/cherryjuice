import { CustomRange } from '::root/components/editor/helpers/execK/steps/get-selection';
import {
  getDDOE,
  getIndexOfSubDDOE,
} from '::root/components/editor/helpers/execK/steps/pipe1/ddoes';

const codeBoxDelimiter = '\u200B';
const cursorIsAtBoxDelimiter = (range: CustomRange) => {
  return (
    range.endElement.nodeType === Node.TEXT_NODE &&
    (range.endElement as Text).textContent === codeBoxDelimiter
  );
};

export type CursorPosition = {
  afterCodeBox: boolean;
  beforeTable: boolean;
  insideTable: boolean;
  insideCodeBox: boolean;
  isAtBoxDelimiter: boolean;
  beforeCodeBox: boolean;
  atStartOfDDOE: boolean;
};
export const getCursorPosition = (selection: CustomRange): CursorPosition => {
  const insideCodeBox = Boolean(
    selection.startElement.parentElement.closest('.rich-text__code'),
  );

  const atStartOfDDOE =
    getIndexOfSubDDOE({
      DDOE: getDDOE(selection.startElement),
      selectionElement: selection.startElement,
    }) === 0 && selection.startOffset === 0;

  const isAtBoxDelimiter = cursorIsAtBoxDelimiter(selection);
  const beforeCodeBox =
    !insideCodeBox &&
    isAtBoxDelimiter &&
    selection.startElement.parentElement.nextElementSibling?.localName ===
      'code';
  const afterCodeBox =
    !beforeCodeBox &&
    selection.startElement.parentElement.previousElementSibling?.localName ===
      'code';

  const beforeTable =
    !afterCodeBox &&
    selection.startElement.nodeType === Node.ELEMENT_NODE &&
    ((selection.startElement as unknown) as Element).classList.contains(
      'rich-text__table',
    );

  const insideTable =
    !beforeTable &&
    Boolean(selection.startElement.parentElement.closest('.rich-text__table'));

  return {
    insideCodeBox,
    afterCodeBox,
    beforeCodeBox,
    beforeTable,
    insideTable,
    isAtBoxDelimiter,
    atStartOfDDOE,
  };
};
