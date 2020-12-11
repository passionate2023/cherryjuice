import { EnhancedMutationRecord } from '::helpers/snapback/snapback/snapback';
import { calculateTextDifference } from '::helpers/snapback/snapback/helpers/restore-caret/helpers/calculate-text-difference';

export const textMutation = (
  mutations: EnhancedMutationRecord[],
  undo: boolean,
) => {
  const mutation = mutations[mutations.length - 1];
  let offset, caretTarget;
  const { newValue, oldValue } = mutation;
  if (newValue.startsWith(oldValue))
    offset = undo ? oldValue.length : newValue.length;
  else {
    const diff = calculateTextDifference(oldValue, newValue);
    offset = diff.offset + (undo ? 0 : diff.length);
  }
  caretTarget = mutation.target.lastChild || mutation.target;
  return [offset, caretTarget];
};
