import {
  EnhancedMutationRecord,
  Frame,
} from '::editor/helpers/snapback/snapback/snapback';
import { MutationType } from '::editor/helpers/snapback/snapback/helpers/detect-mutation-type';

const replaceNBSPWithSpace = (word: string): string =>
  word.replace(new RegExp(`${String.fromCharCode(160)}`, 'g'), ' ');
const endsWithDelimiter = (word: string): boolean => /.+[\s,.]$/.test(word);
const removeDelimiter = (word: string): string => word.replace(/[\s,.]$/, '');
const isMutationOnPreviousNode = (
  oldMutation: EnhancedMutationRecord,
  newMutation: EnhancedMutationRecord,
) => {
  const mutationOnSameNode =
    (Boolean(oldMutation) &&
      oldMutation.type === newMutation.type &&
      oldMutation.target === newMutation.target) ||
    !oldMutation;
  const o_newValue = oldMutation?.newValue;
  const n_oldValue = newMutation.oldValue;
  const n_newValue = newMutation.newValue;

  const textMutation = o_newValue === n_oldValue || (n_oldValue && !o_newValue);
  const additiveMutation =
    textMutation && n_newValue.length > n_oldValue.length;
  const subtractiveMutation =
    textMutation && n_newValue.length < n_oldValue.length;
  const noopMutation = mutationOnSameNode && o_newValue === n_newValue;
  const whiteSpaceNoOp =
    !noopMutation &&
    !textMutation &&
    replaceNBSPWithSpace(n_oldValue) === replaceNBSPWithSpace(n_newValue);
  return {
    whiteSpaceNoOp,
    mutationOnSameNode,
    additiveMutation,
    noopMutation,
    subtractiveMutation,
  };
};

export const handleTextMutation = (
  newMutation: EnhancedMutationRecord,
  latestFrame: Frame,
): Frame | undefined => {
  const valueEndsWithDelimiter = endsWithDelimiter(newMutation.newValue);
  const latestFrameMutations = latestFrame?.mutations || [];
  const latestMutation = latestFrameMutations[latestFrameMutations.length - 1];
  const {
    additiveMutation,
    noopMutation,
    subtractiveMutation,
    whiteSpaceNoOp,
  } = isMutationOnPreviousNode(latestMutation, newMutation);
  const latestFrameWasDeletion = latestFrame?.type === MutationType.deletion;
  const latestFrameWasText = latestFrame?.type === MutationType.text;
  if (noopMutation) {
    return;
  } else if (additiveMutation && latestFrameWasText) {
    if (valueEndsWithDelimiter) {
      latestMutation.newValue = removeDelimiter(newMutation.newValue);
      return { mutations: [], type: MutationType.text };
    } else {
      latestMutation.newValue = newMutation.newValue;
    }
  } else if (subtractiveMutation && latestFrameWasDeletion) {
    if (valueEndsWithDelimiter) {
      latestMutation.newValue = removeDelimiter(newMutation.newValue);
      return { mutations: [], type: MutationType.deletion };
    } else latestMutation.newValue = newMutation.newValue;
  } else {
    return {
      mutations: [newMutation],
      type: whiteSpaceNoOp
        ? latestFrame.type || MutationType.text
        : subtractiveMutation
        ? MutationType.deletion
        : MutationType.text,
    };
  }
};
