import { EnhancedMutationRecord } from '::root/components/app/components/editor/tool-bar/components/groups/main-buttons/undo-redo/helpers/snapback/snapback/snapback';
import { getIndexOfNode } from '::root/components/app/components/editor/tool-bar/components/groups/main-buttons/undo-redo/helpers/snapback/snapback/helpers/restore-caret/helpers/get-index-of-child-node';

export const redoPastingMutation = (mutations: EnhancedMutationRecord[]) => {
  let offset, caretTarget;
  const isSingleLinePaste = mutations.length === 8;
  if (isSingleLinePaste) {
    const mutation = mutations[mutations.length - 2];
    const addedNode = mutation.addedNodes[mutation.addedNodes.length - 1];
    caretTarget = addedNode.parentElement;
    offset = getIndexOfNode(addedNode as ChildNode) + 1;
  } else {
    const mutation = mutations[mutations.length - 1];
    if (mutation.target['localName'] === 'img') {
      offset = getIndexOfNode(mutation.target as ChildNode) + 1;
      caretTarget = mutation.target.parentElement;
    } else {
      offset = 0;
      caretTarget = mutation.target;
    }
  }

  return [offset, caretTarget];
};
