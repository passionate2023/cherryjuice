import { CustomRange } from '::helpers/editing/execK/steps/get-selection';

export const getCursorPosition = (selection: CustomRange) => {
  const insideCodeBox = Boolean(
    selection.startElement.parentElement.closest('.rich-text__code'),
  );

  const beforeTable =
    !insideCodeBox &&
    selection.startElement.nodeType === Node.ELEMENT_NODE &&
    ((selection.startElement as unknown) as Element).classList.contains(
      'rich-text__table',
    );

  const insideTable =
    !beforeTable &&
    Boolean(selection.startElement.parentElement.closest('.rich-text__table'));

  return { insideCodeBox, beforeTable, insideTable };
};
