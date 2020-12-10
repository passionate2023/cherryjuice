import { EnhancedMutationRecord } from '::helpers/snapback/snapback/snapback';
import { MutationType } from '::helpers/snapback/snapback/helpers/detect-mutation-type';

const prefixes: Partial<Record<MutationType, string>> = {
  [MutationType.structure]: 's',
  [MutationType.pane]: 'pn',
  [MutationType.pasting]: 'p',
  [MutationType.object]: 'o',
  [MutationType.deletion]: 'd',
  [MutationType.formatting]: '',
};

export const undoExecKMutation = (
  mutations: EnhancedMutationRecord[],
  type: MutationType,
) => {
  let offset, caretTarget;
  const mutation = mutations.filter(
    m =>
      m.type === 'attributes' &&
      m.attributeName.startsWith(prefixes[type] + 'selection-offset'),
  )[0];
  if (mutation)
    if (
      type === MutationType.formatting &&
      !document.contains(mutation.target)
    ) {
      caretTarget = mutations[mutations.length - 1].target;
      offset = mutation.target.childNodes.length;
    } else if (type === MutationType.deletion) {
      caretTarget = mutation.target;
      offset = mutation.target.childNodes.length;
    } else {
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

export const redoDeletionMutation = (mutations: EnhancedMutationRecord[]) => {
  let offset, caretTarget;
  const mutation = mutations[mutations.length - 1];
  caretTarget =
    mutation.previousSibling ||
    mutation.nextSibling ||
    mutation.target.parentElement;
  offset = caretTarget.childNodes.length;

  return [offset, caretTarget];
};
