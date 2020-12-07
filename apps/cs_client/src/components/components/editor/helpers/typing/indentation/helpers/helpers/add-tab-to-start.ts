import { elementHasText } from '::editor/helpers/execK/helpers';
import { getDeepestFirstChild } from '::editor/helpers/execK/steps/restore-selection';
import { QUAD_SPACE } from '@cherryjuice/ahtml-to-html';

export const addTabToStart = ddoe => {
  const ddoeIsNotEmpty = elementHasText(ddoe);

  if (ddoeIsNotEmpty) {
    const deepestFirstChild = getDeepestFirstChild(ddoe);

    if (deepestFirstChild.nodeType === Node.ELEMENT_NODE) {
      (deepestFirstChild as Element).insertAdjacentHTML(
        'beforebegin',
        `<span>${QUAD_SPACE}</span>`,
      );
    } else {
      (deepestFirstChild as Text).insertData(0, QUAD_SPACE);
    }
  }
};
