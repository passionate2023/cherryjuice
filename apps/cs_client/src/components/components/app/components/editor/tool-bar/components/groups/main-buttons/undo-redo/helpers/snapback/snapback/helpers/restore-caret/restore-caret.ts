import { EnhancedMutationRecord } from '::root/components/app/components/editor/tool-bar/components/groups/main-buttons/undo-redo/helpers/snapback/snapback/snapback';
import { setRange } from '::root/components/app/components/editor/tool-bar/components/groups/main-buttons/undo-redo/helpers/snapback/snapback/helpers/restore-caret/helpers/set-range';
import { MutationType } from '::root/components/app/components/editor/tool-bar/components/groups/main-buttons/undo-redo/helpers/snapback/snapback/helpers/detect-mutation-type';
import {
  redoFormattingMutation,
  undoFormattingMutation,
} from '::root/components/app/components/editor/tool-bar/components/groups/main-buttons/undo-redo/helpers/snapback/snapback/helpers/restore-caret/helpers/calculate-position/formatting-mutation';
import { textMutation } from '::root/components/app/components/editor/tool-bar/components/groups/main-buttons/undo-redo/helpers/snapback/snapback/helpers/restore-caret/helpers/calculate-position/text-mutation';
import { genericMutation } from '::root/components/app/components/editor/tool-bar/components/groups/main-buttons/undo-redo/helpers/snapback/snapback/helpers/restore-caret/helpers/calculate-position/generic-mutation';
import {
  redoStructureMutation,
  undoStructureMutation,
} from '::root/components/app/components/editor/tool-bar/components/groups/main-buttons/undo-redo/helpers/snapback/snapback/helpers/restore-caret/helpers/calculate-position/structure-mutation';
import {
  redoPastingMutation,
  undoPastingMutation,
} from '::root/components/app/components/editor/tool-bar/components/groups/main-buttons/undo-redo/helpers/snapback/snapback/helpers/restore-caret/helpers/calculate-position/pasting-mutation';

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
        ? undoFormattingMutation(mutations)
        : redoFormattingMutation(mutations);
    } else if (type === MutationType.structure) {
      [offset, caretTarget] = undo
        ? undoStructureMutation(mutations)
        : redoStructureMutation(mutations);
    } else if (type === MutationType.pasting) {
      [offset, caretTarget] = undo
        ? undoPastingMutation(mutations)
        : redoPastingMutation(mutations);
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
