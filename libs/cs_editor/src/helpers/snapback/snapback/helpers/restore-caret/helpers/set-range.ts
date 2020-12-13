import { smoothScrollIntoView } from '@cherryjuice/shared-helpers';

export const setRange = (range: Range, scrollIntoSelection = true) => {
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
  if (scrollIntoSelection)
    smoothScrollIntoView(range.startContainer.parentElement);
};
