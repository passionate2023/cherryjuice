import { EnhancedMutationRecord } from '::helpers/snapback/snapback/snapback';
import { getIndexOfNode } from '::helpers/snapback/snapback/helpers/restore-caret/helpers/get-index-of-child-node';

const objects = new Set(['img', 'code', 'table']);
export const genericMutation = (
  mutations: EnhancedMutationRecord[],
  undo: boolean,
) => {
  const mutation = mutations[mutations.length - 1];
  const mutationTarget = mutation.target;
  let offset, caretTarget;
  caretTarget =
    mutationTarget.nodeType === Node.TEXT_NODE
      ? mutationTarget
      : mutationTarget.lastChild || mutationTarget;
  if (caretTarget.nodeType === Node.TEXT_NODE) {
    offset = caretTarget.textContent.length;
  } else {
    if (objects.has(caretTarget['localName'])) {
      offset = getIndexOfNode(caretTarget as ChildNode) + (undo ? 0 : 1);
      caretTarget = caretTarget.parentElement;
    } else {
      const redoExecK = !undo && mutation.addedNodes.length;
      if (redoExecK) {
        caretTarget = mutation.addedNodes[mutation.addedNodes.length - 1];
      } else {
        const length = caretTarget['innerText']?.length;
        offset = length + (length > 0 ? -1 : 0);
      }
    }
  }
  return [offset, caretTarget];
};
