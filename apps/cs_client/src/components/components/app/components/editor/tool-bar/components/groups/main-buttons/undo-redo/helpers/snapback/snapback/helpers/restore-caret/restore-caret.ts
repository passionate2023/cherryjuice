import { EnhancedMutationRecord } from '::root/components/app/components/editor/tool-bar/components/groups/main-buttons/undo-redo/helpers/snapback/snapback/snapback';
import { calculateTextDifference } from '::root/components/app/components/editor/tool-bar/components/groups/main-buttons/undo-redo/helpers/snapback/snapback/helpers/restore-caret/helpers/calculate-text-difference';
import { getIndexOfNode } from '::root/components/app/components/editor/tool-bar/components/groups/main-buttons/undo-redo/helpers/snapback/snapback/helpers/restore-caret/helpers/get-index-of-child-node';
import { setRange } from '::root/components/app/components/editor/tool-bar/components/groups/main-buttons/undo-redo/helpers/snapback/snapback/helpers/restore-caret/helpers/set-range';

const objects = new Set(['img', 'code', 'table']);

export const restoreCaret = (
  mutations: EnhancedMutationRecord[],
  undo: boolean,
) => {
  const lastMutation = mutations[mutations.length - 1];
  const mutationTarget = lastMutation.target;
  let caretTarget, offset: number;
  try {
    if (lastMutation.type === 'characterData') {
      const { newValue, oldValue } = lastMutation;
      if (newValue.startsWith(oldValue))
        offset = undo ? oldValue.length : newValue.length;
      else {
        const diff = calculateTextDifference(oldValue, newValue);
        offset = diff.offset + (undo ? 0 : diff.length);
      }
    } else {
      caretTarget =
        mutationTarget.nodeType === Node.TEXT_NODE
          ? mutationTarget
          : mutationTarget.lastChild || mutationTarget;
      if (caretTarget.nodeType === Node.TEXT_NODE)
        offset = caretTarget.textContent.length;
      else {
        if (objects.has(caretTarget['localName'])) {
          offset = getIndexOfNode(caretTarget as ChildNode) + (undo ? 0 : 1);
          caretTarget = caretTarget.parentElement;
        } else {
          const redoExecK = !undo && lastMutation.addedNodes.length;
          if (redoExecK) {
            caretTarget =
              lastMutation.addedNodes[lastMutation.addedNodes.length - 1];
          } else {
            const length = caretTarget['innerText']?.length;
            offset = length + (length > 0 ? -1 : 0);
          }
        }
      }
    }

    const range = document.createRange();
    range.setStart(caretTarget, offset);
    setRange(range, false);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    // eslint-disable-next-line no-console
    console.log(caretTarget);
    // eslint-disable-next-line no-console
    console.log(mutations);
  }
};
