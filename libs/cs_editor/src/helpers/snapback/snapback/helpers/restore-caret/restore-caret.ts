import { EnhancedMutationRecord } from '::helpers/snapback/snapback/snapback';
import { setRange } from '::helpers/snapback/snapback/helpers/restore-caret/helpers/set-range';
import { MutationType } from '::helpers/snapback/snapback/helpers/detect-mutation-type';
import { redoFormattingMutation } from '::helpers/snapback/snapback/helpers/restore-caret/helpers/calculate-position/formatting-mutation';
import { textMutation } from '::helpers/snapback/snapback/helpers/restore-caret/helpers/calculate-position/text-mutation';
import { genericMutation } from '::helpers/snapback/snapback/helpers/restore-caret/helpers/calculate-position/generic-mutation';
import {
  redoDeletionMutation,
  redoStructureMutation,
  undoExecKMutation,
} from '::helpers/snapback/snapback/helpers/restore-caret/helpers/calculate-position/structure-mutation';
import { redoPastingMutation } from '::helpers/snapback/snapback/helpers/restore-caret/helpers/calculate-position/pasting-mutation';
import { redoObjectMutation } from '::helpers/snapback/snapback/helpers/restore-caret/helpers/calculate-position/object-mutation';
import { trimOffset } from '::helpers/execK/helpers/trim-offset';

export const restoreCaret = (
  mutations: EnhancedMutationRecord[],
  type: MutationType,
  undo: boolean,
) => {
  let caretTarget: Node, offset: number;
  try {
    if (type === MutationType.text) {
      [offset, caretTarget] = textMutation(mutations, undo);
    } else if (type === MutationType.formatting) {
      [offset, caretTarget] = undo
        ? undoExecKMutation(mutations, type)
        : redoFormattingMutation(mutations);
    } else if (type === MutationType.structure) {
      [offset, caretTarget] = undo
        ? undoExecKMutation(mutations, type)
        : redoStructureMutation(mutations);
    } else if (type === MutationType.deletion) {
      [offset, caretTarget] = undo
        ? undoExecKMutation(mutations, type)
        : redoDeletionMutation(mutations);
    } else if (type === MutationType.pane) {
      [offset, caretTarget] = undoExecKMutation(mutations, type);
    } else if (type === MutationType.pasting) {
      [offset, caretTarget] = undo
        ? undoExecKMutation(mutations, type)
        : redoPastingMutation(mutations);
    } else if (type === MutationType.object) {
      [offset, caretTarget] = undo
        ? undoExecKMutation(mutations, type)
        : redoObjectMutation(mutations, undo);
    } else {
      [offset, caretTarget] = genericMutation(mutations, undo);
    }
    if (caretTarget) {
      const range = document.createRange();
      range.setStart(...trimOffset(caretTarget, offset));
      setRange(range, false);
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    // eslint-disable-next-line no-console
    console.log({ caretTarget, mutations });
  }
};
