import { getDeepestFirstChild } from '::helpers/editing/execK/steps/restore-selection';
import {
  deleteSubDDOEsThatStartWithSpaceAndGetTheirText,
  negativeIndent,
} from '::helpers/editing/typing/indentation/helpers/negative-indent';
import { elementHasText } from '::helpers/editing/execK/helpers';

const removeATabFromTheStartOfTheLine = ddoe => {
  const {
    textOfNodes,
    firstSubDDOEThatISNotFullOfSpaces,
    firstSubDDOEStartsWithSpace,
  } = deleteSubDDOEsThatStartWithSpaceAndGetTheirText(ddoe, {
    deleteFirstSubDDOEThatHasWords: false,
  });
  const str = negativeIndent(textOfNodes);
  let deepestFirstChild;
  if (firstSubDDOEThatISNotFullOfSpaces) {
    deepestFirstChild = getDeepestFirstChild(
      firstSubDDOEThatISNotFullOfSpaces,
    ) as Text;
    if (firstSubDDOEStartsWithSpace)
      deepestFirstChild.replaceData(0, deepestFirstChild.wholeText.length, str);
    else deepestFirstChild.insertData(0, str);
  } else {
    deepestFirstChild = getDeepestFirstChild(ddoe) as Element;
    if (deepestFirstChild && str) {
      if (deepestFirstChild.nodeType === Node.TEXT_NODE)
        deepestFirstChild = deepestFirstChild.parentElement;
      deepestFirstChild.insertAdjacentHTML('beforebegin', `<span>${str}</span`);
    }
  }
  return {
    removedCharactersLength: textOfNodes.join('').length - str.length,
    nextSelectedElement: deepestFirstChild,
  };
};

const addATabToTheStartOfTheLine = ddoe => {
  const ddoeIsNotEmpty = elementHasText(ddoe);

  if (ddoeIsNotEmpty) {
    const deepestFirstChild = getDeepestFirstChild(ddoe);

    if (deepestFirstChild.nodeType === Node.ELEMENT_NODE) {
      (deepestFirstChild as Element).insertAdjacentHTML(
        'beforebegin',
        '<span>\u00A0 \u00A0 </span>',
      );
    } else {
      (deepestFirstChild as Text).insertData(0, '\u00A0 \u00A0 ');
    }
  }
};

const addATabAfterCursor = ({ startElement, startOffset }) => {
  const deepestFirstChild = getDeepestFirstChild(startElement);
  if (deepestFirstChild.nodeType === Node.ELEMENT_NODE) {
    deepestFirstChild.appendChild(document.createTextNode('\u00A0 \u00A0 '));
  } else if (deepestFirstChild.nodeType === Node.TEXT_NODE)
    (deepestFirstChild as Text).insertData(startOffset, '\u00A0 \u00A0 ');
};

export {
  addATabAfterCursor,
  addATabToTheStartOfTheLine,
  removeATabFromTheStartOfTheLine,
};
