import { EnhancedMutationRecord } from '::root/components/app/components/editor/tool-bar/components/groups/main-buttons/undo-redo/helpers/snapback/snapback/snapback';
import { getIndexOfNode } from '::root/components/app/components/editor/tool-bar/components/groups/main-buttons/undo-redo/helpers/snapback/snapback/helpers/restore-caret/helpers/get-index-of-child-node';

export const undoFormattingMutation = (mutations: EnhancedMutationRecord[]) => {
  let offset, caretTarget;
  const mutation = mutations.filter(
    m => m.type === 'attributes' && m.attributeName.startsWith('selection-end'),
  )[0];
  if (mutation) {
    caretTarget = mutation.target.parentElement;
    offset = getIndexOfNode(mutation.target as ChildNode) + 1;
  }

  return [offset, caretTarget];
};

export const redoFormattingMutation = (mutations: EnhancedMutationRecord[]) => {
  let offset, caretTarget;
  const mutation = mutations.filter(
    m => m.removedNodes[0] && m.removedNodes[0]['id'] === 'end-anchor',
  )[0];
  if (mutation.previousSibling) {
    caretTarget = mutation.previousSibling.parentElement;
    offset = getIndexOfNode(mutation.previousSibling as ChildNode) + 1;
  } else if (mutation.nextSibling) {
    caretTarget = mutation.nextSibling.parentElement;
    offset = getIndexOfNode(mutation.nextSibling as ChildNode);
  } else {
    caretTarget = mutation.removedNodes[0].parentElement;
    offset = caretTarget.childNodes.length;
  }
  return [offset, caretTarget];
};
