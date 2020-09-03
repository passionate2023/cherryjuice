import { getDeepestFirstChild } from '::helpers/editing/execK/steps/restore-selection';

export const addTabToEnd = ({ startElement, startOffset }) => {
  const deepestFirstChild = getDeepestFirstChild(startElement);
  if (deepestFirstChild.nodeType === Node.ELEMENT_NODE) {
    deepestFirstChild.appendChild(document.createTextNode('\u00A0 \u00A0 '));
  } else if (deepestFirstChild.nodeType === Node.TEXT_NODE)
    (deepestFirstChild as Text).insertData(startOffset, '\u00A0 \u00A0 ');
};
