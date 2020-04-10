import { FormattingError } from '::types/errors';

const codeBoxDelimiter = '\u200B';
const isAboutToDeleteCodeBoxDelimiter = () => {
  const selection = document.getSelection();
  if (selection.rangeCount === 0)
    throw new FormattingError('Could not find the cursor');
  const { endContainer } = selection.getRangeAt(0);
  const isAboutToDeleteCodeBoxSeparator =
    endContainer.nodeType === Node.TEXT_NODE &&
    (endContainer as Text).textContent === codeBoxDelimiter;
  return { isAboutToDeleteCodeBoxSeparator, endContainer };
};
const handleBackSpace = e => {
  const {
    isAboutToDeleteCodeBoxSeparator,
    endContainer,
  } = isAboutToDeleteCodeBoxDelimiter();
  if (isAboutToDeleteCodeBoxSeparator) {
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
