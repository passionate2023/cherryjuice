import { smoothScrollIntoView } from '::root/components/app/components/editor/document/components/title-and-recent-nodes/components/components/tab';

export const setRange = (range: Range, scrollIntoSelection = true) => {
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
  if (scrollIntoSelection)
    smoothScrollIntoView(range.startContainer.parentElement);
};
