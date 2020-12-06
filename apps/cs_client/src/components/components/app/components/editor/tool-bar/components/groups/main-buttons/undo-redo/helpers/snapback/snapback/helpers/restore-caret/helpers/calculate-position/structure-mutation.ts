import { EnhancedMutationRecord } from '::root/components/app/components/editor/tool-bar/components/groups/main-buttons/undo-redo/helpers/snapback/snapback/snapback';

export const undoStructureMutation = (mutations: EnhancedMutationRecord[]) => {
  let offset, caretTarget;
  const mutation = mutations.filter(
    m =>
      m.type === 'attributes' &&
      m.attributeName.startsWith('sselection-offset'),
  )[0];
  if (mutation) {
    offset = mutation.newValue;
    caretTarget = mutation.target.lastChild || mutation.target;
  }

  return [offset, caretTarget];
};
export const redoStructureMutation = (mutations: EnhancedMutationRecord[]) => {
  let offset, caretTarget;
  const mutation = mutations[mutations.length - 1];
  offset = 0;
  caretTarget = mutation.target;

  return [offset, caretTarget];
};
