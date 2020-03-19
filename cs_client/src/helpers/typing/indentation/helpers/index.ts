import { getDeepestFirstChild } from '::helpers/execK/steps/restore-selection';
import {
  deleteSubDDOEsThatStartWithSpaceAndGetTheirText,
  negativeIndent,
} from '::helpers/typing/indentation/helpers/negative-indent';
import { elementHasText,  } from '::helpers/execK/helpers';

const removeATabFromTheStartOfTheLine = ddoe => {
  const {
    textOfNodes,
    firstSubDDOEThatISNotFullOfSpaces,
    firstSubDDOEStartsWithSpace,
  } = deleteSubDDOEsThatStartWithSpaceAndGetTheirText(ddoe, {
    deleteFirstSubDDOEThatHasWords: false,
  });
  const str = negativeIndent(textOfNodes);
  if (firstSubDDOEThatISNotFullOfSpaces) {
    const deepestFirstChild = getDeepestFirstChild(
      firstSubDDOEThatISNotFullOfSpaces,
    );
    if (firstSubDDOEStartsWithSpace)
      deepestFirstChild.replaceData(0, deepestFirstChild.wholeText.length, str);
    else deepestFirstChild.insertData(0, str);
  } else if (str) {
    const deepestFirstChild = getDeepestFirstChild(ddoe);
    deepestFirstChild.insertAdjacentHTML('beforebegin', `<span>${str}</span`);
  }
  return { removedCharactersLength: textOfNodes.join('').length - str.length };
};

const addATabToTheStartOfTheLine = ddoe => {
  const ddoeIsNotEmpty = elementHasText(ddoe);

  if (ddoeIsNotEmpty) {
    const deepestFirstChild = getDeepestFirstChild(ddoe);
    if (deepestFirstChild.insertData)
      deepestFirstChild.insertData(0, '\u00A0 \u00A0 ');
    else {
      deepestFirstChild.insertAdjacentHTML(
        'beforebegin',
        '<span>\u00A0 \u00A0 </span>',
      );
    }
  }
};

const addATabAfterCursor = ({ startElement, startOffset }) => {
  const deepestFirstChild = getDeepestFirstChild(startElement);
  if (deepestFirstChild.insertData)
    deepestFirstChild.insertData(startOffset, '\u00A0 \u00A0 ');
  else {
    deepestFirstChild.insertAdjacentHTML(
      'beforebegin',
      '<span>\u00A0 \u00A0 </span>',
    );
  }
};

export {
  addATabAfterCursor,
  addATabToTheStartOfTheLine,
  removeATabFromTheStartOfTheLine,
};
