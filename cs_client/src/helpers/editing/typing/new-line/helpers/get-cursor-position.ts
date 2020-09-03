import { CustomRange } from '::helpers/editing/execK/steps/get-selection';

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
};
export const getCursorPosition = (selection: CustomRange): CursorPosition => {
  const insideCodeBox = Boolean(
    selection.startElement.parentElement.closest('.rich-text__code'),
  );

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
  };
};
