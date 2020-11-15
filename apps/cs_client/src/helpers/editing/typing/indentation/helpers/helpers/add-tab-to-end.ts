import { getDeepestFirstChild } from '::helpers/editing/execK/steps/restore-selection';
import { QUAD_SPACE } from '@cherryjuice/ahtml-to-html';

export const addTabToEnd = ({ startElement, startOffset }) => {
  const deepestFirstChild = getDeepestFirstChild(startElement);
  if (deepestFirstChild.nodeType === Node.ELEMENT_NODE) {
    deepestFirstChild.appendChild(document.createTextNode(QUAD_SPACE));
  } else if (deepestFirstChild.nodeType === Node.TEXT_NODE)
    (deepestFirstChild as Text).insertData(startOffset, QUAD_SPACE);
};
