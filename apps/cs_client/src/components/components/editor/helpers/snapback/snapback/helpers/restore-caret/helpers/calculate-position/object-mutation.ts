import { EnhancedMutationRecord } from '::root/components/editor/helpers/snapback/snapback/snapback';
import { getIndexOfNode } from '::root/components/editor/helpers/snapback/snapback/helpers/restore-caret/helpers/get-index-of-child-node';

export const redoObjectMutation = (
  mutations: EnhancedMutationRecord[],
  undo: boolean,
) => {
  let offset, caretTarget;

  const mutation = mutations[mutations.length - 1];
  const mutationTarget = mutation.target;
  caretTarget =
    mutationTarget.nodeType === Node.TEXT_NODE
      ? mutationTarget
      : mutationTarget.lastChild || mutationTarget;
  offset = getIndexOfNode(caretTarget as ChildNode) + (undo ? 0 : 1);
  caretTarget = caretTarget.parentElement;
  return [offset, caretTarget];
};
