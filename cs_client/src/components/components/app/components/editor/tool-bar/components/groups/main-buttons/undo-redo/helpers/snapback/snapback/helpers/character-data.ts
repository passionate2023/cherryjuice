import { EnhancedMutationRecord } from '::root/components/app/components/editor/tool-bar/components/groups/main-buttons/undo-redo/helpers/snapback/snapback';

export const endsWithDelimiter = (word: string): boolean => /.+[\s,.]$/.test(word);
export const removeDelimiter = (word: string): string => word.replace(/[\s,.]$/, '');
export const isMutationOnPreviousNode = (
  oldMutation: EnhancedMutationRecord,
  newMutation: EnhancedMutationRecord,
) => {
  const mutationOnSameNode =
    Boolean(oldMutation) &&
    oldMutation.type === newMutation.type &&
    oldMutation.target === newMutation.target;
  const additiveMutation =
    mutationOnSameNode && oldMutation.newValue === newMutation.oldValue;
  const noopMutation =
    mutationOnSameNode && oldMutation.newValue === newMutation.newValue;
  return { mutationOnSameNode, additiveMutation, noopMutation };
};