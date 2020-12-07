import { EnhancedMutationRecord } from '::root/components/editor/helpers/snapback/snapback/snapback';
import { getIndexOfNode } from '::root/components/editor/helpers/snapback/snapback/helpers/restore-caret/helpers/get-index-of-child-node';

type Prefix = 'structure' | 'pasting' | 'object' | 'formatting';
const prefixes: Record<Prefix, string> = {
  structure: 's',
  pasting: 'p',
  object: 'o',
  formatting: '',
};
export const undoExecKMutation = (
  mutations: EnhancedMutationRecord[],
  type: Prefix,
) => {
  let offset, caretTarget;
  const mutation = mutations.filter(
    m =>
      m.type === 'attributes' &&
      m.attributeName.startsWith(prefixes[type] + 'selection-offset'),
  )[0];
  if (mutation)
    if (type === 'formatting') {
      caretTarget = mutation.target.parentElement;
      offset = getIndexOfNode(mutation.target as ChildNode) + 1;
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
