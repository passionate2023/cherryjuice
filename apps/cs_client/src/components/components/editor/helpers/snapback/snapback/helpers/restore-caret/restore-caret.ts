import { EnhancedMutationRecord } from '::editor/helpers/snapback/snapback/snapback';
import { setRange } from '::editor/helpers/snapback/snapback/helpers/restore-caret/helpers/set-range';
import { MutationType } from '::editor/helpers/snapback/snapback/helpers/detect-mutation-type';
import { redoFormattingMutation } from '::editor/helpers/snapback/snapback/helpers/restore-caret/helpers/calculate-position/formatting-mutation';
import { textMutation } from '::editor/helpers/snapback/snapback/helpers/restore-caret/helpers/calculate-position/text-mutation';
import { genericMutation } from '::editor/helpers/snapback/snapback/helpers/restore-caret/helpers/calculate-position/generic-mutation';
import {
  redoStructureMutation,
  undoExecKMutation,
} from '::editor/helpers/snapback/snapback/helpers/restore-caret/helpers/calculate-position/structure-mutation';
import { redoPastingMutation } from '::editor/helpers/snapback/snapback/helpers/restore-caret/helpers/calculate-position/pasting-mutation';
import { redoObjectMutation } from '::editor/helpers/snapback/snapback/helpers/restore-caret/helpers/calculate-position/object-mutation';

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
        ? undoExecKMutation(mutations, 'formatting')
        : redoFormattingMutation(mutations);
    } else if (type === MutationType.structure) {
      [offset, caretTarget] = undo
        ? undoExecKMutation(mutations, 'structure')
        : redoStructureMutation(mutations);
    } else if (type === MutationType.pasting) {
      [offset, caretTarget] = undo
        ? undoExecKMutation(mutations, 'pasting')
        : redoPastingMutation(mutations);
    } else if (type === MutationType.object) {
      [offset, caretTarget] = undo
        ? undoExecKMutation(mutations, 'object')
        : redoObjectMutation(mutations, undo);
    } else {
      [offset, caretTarget] = genericMutation(mutations, undo);
    }
    if (caretTarget) {
      const range = document.createRange();
      range.setStart(caretTarget, offset);
      setRange(range, false);
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    // eslint-disable-next-line no-console
    console.log({ caretTarget, mutations });
  }
};
