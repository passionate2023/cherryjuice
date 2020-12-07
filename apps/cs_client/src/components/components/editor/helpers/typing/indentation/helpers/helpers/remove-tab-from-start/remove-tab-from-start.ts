import { deleteSubDDOEsThatStartWithSpaceAndGetTheirText } from '::editor/helpers/typing/indentation/helpers/helpers/remove-tab-from-start/helpers/delete-sub-ddoes';
import { removeTabFromStringStart } from '::editor/helpers/typing/indentation/helpers/helpers/remove-tab-from-start/helpers/remove-tab-from-string-start/remove-tab-from-string-start';
import { getDeepestFirstChild } from '::editor/helpers/execK/steps/restore-selection';

export const removeTabFromStart = ddoe => {
  const {
    textOfNodes,
    firstSubDDOEThatISNotFullOfSpaces,
    firstSubDDOEStartsWithSpace,
  } = deleteSubDDOEsThatStartWithSpaceAndGetTheirText(ddoe, {
    deleteFirstSubDDOEThatHasWords: false,
  });
  const str = removeTabFromStringStart(textOfNodes);
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
