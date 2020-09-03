import { elementHasText } from '::helpers/editing/execK/helpers';
import { getDeepestFirstChild } from '::helpers/editing/execK/steps/restore-selection';

export const addTabToStart = ddoe => {
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