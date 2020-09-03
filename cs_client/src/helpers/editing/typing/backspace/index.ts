import { FormattingError } from '::types/errors';
import { CustomRange } from '::helpers/editing/execK/steps/get-selection';

const codeBoxDelimiter = '\u200B';
export const cursorIsAtBoxDelimiter = (range?: Range | CustomRange) => {
  range = range || document.getSelection().getRangeAt(0);
  if (!range) throw new FormattingError('Could not find the cursor');
  const endContainer =
    'endContainer' in range ? range['endContainer'] : range.endElement;
  const isAtBoxDelimiter =
    endContainer.nodeType === Node.TEXT_NODE &&
    (endContainer as Text).textContent === codeBoxDelimiter;
  return { isAtBoxDelimiter, endContainer };
};
const handleBackSpace = e => {
  const { isAtBoxDelimiter, endContainer } = cursorIsAtBoxDelimiter();
  if (isAtBoxDelimiter) {
    const previousSibling:
      | Element
      | undefined = document.getSelection().getRangeAt(0).startContainer
      .parentElement.previousElementSibling;
    if (previousSibling?.localName === 'code') {
      endContainer.parentElement.remove();
      previousSibling.remove();
      e.preventDefault();
    }
  }
};
export { handleBackSpace };
