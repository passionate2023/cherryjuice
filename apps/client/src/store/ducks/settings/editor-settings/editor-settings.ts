import { createActionCreator as _, createReducer } from 'deox';
import { createActionPrefixer } from '::store/ducks/helpers/shared';
import produce from 'immer';
import { setValue } from '::store/ducks/settings/editor-settings/reducers/set-value';
import { EditorSettings } from '@cherryjuice/graphql-types';
import { authActionCreators } from '::store/ducks/auth';
import { getDefaultSettings } from '@cherryjuice/default-settings';
import { rootActionCreators as rac } from '::store/ducks/root';
import { cloneObj } from '@cherryjuice/shared-helpers';

const ap = createActionPrefixer('editor-settings');

const ac = {
  setCodeBg: _(ap('set-code-bg'), _ => (value: string) => _(value)),
  setCodeFont: _(ap('set-code-font'), _ => (value: string) => _(value)),
  setCodeFontSize: _(ap('set-code-font-size'), _ => (value: number) =>
    _(value),
  ),

  setRichTextBg: _(ap('set-rich-text-bg'), _ => (value: string) => _(value)),
  setRichTextColor: _(ap('set-rich-text-color'), _ => (value: string) =>
    _(value),
  ),
  setRichTextFont: _(ap('set-rich-text-font'), _ => (value: string) =>
    _(value),
  ),
  setRichTextFontSize: _(ap('set-rich-text-font-size'), _ => (value: string) =>
    _(value),
  ),

  setTreeBg: _(ap('set-tree-bg'), _ => (value: string) => _(value)),
  setTreeColor: _(ap('set-tree-color'), _ => (value: string) => _(value)),
  setTreeFont: _(ap('set-tree-font'), _ => (value: string) => _(value)),
  setTreeFontSize: _(ap('set-tree-font-size'), _ => (value: number) =>
    _(value),
  ),

  setMonospaceBg: _(ap('set-monospace-bg'), _ => (value: string) => _(value)),

  undoChanges: _(ap('undo-changes')),
  resetToDefaults: _(ap('reset-to-defaults')),
};
export type Values = {
  monospaceBg: string;
  codeBg: string;
  codeFont: string;
  codeFontSize: string;
  richTextBg: string;
  richTextColor: string;
  richTextFont: string;
  richTextFontSize: string;
  treeBg: string;
  treeColor: string;
  treeFont: string;
  treeFontSize: string;
};
type State = {
  current: EditorSettings;
  previous: EditorSettings;
};

const initialState: State = {
  current: getDefaultSettings().editorSettings,
  previous: undefined,
};

const reducer = createReducer(initialState, _ => [
  _(rac.resetState, () => ({
    ...cloneObj(initialState),
  })),
  _(authActionCreators.setAuthenticationSucceeded, (state, { payload }) => {
    delete payload.settings.editorSettings['__typename'];
    return {
      ...state,
      current: payload.settings.editorSettings,
      previous: undefined,
    };
  }),
  _(ac.setCodeBg, (state, { payload }) =>
    produce(state, setValue.codeBg(payload)),
  ),
  _(ac.setCodeFont, (state, { payload }) =>
    produce(state, setValue.codeFont(payload)),
  ),
  _(ac.setCodeFontSize, (state, { payload }) =>
    produce(state, setValue.codeFontSize(payload + 'px')),
  ),

  _(ac.setRichTextBg, (state, { payload }) =>
    produce(state, setValue.richTextBg(payload)),
  ),
  _(ac.setRichTextColor, (state, { payload }) =>
    produce(state, setValue.richTextColor(payload)),
  ),
  _(ac.setRichTextFont, (state, { payload }) =>
    produce(state, setValue.richTextFont(payload)),
  ),
  _(ac.setRichTextFontSize, (state, { payload }) =>
    produce(state, setValue.richTextFontSize(payload + 'px')),
  ),

  _(ac.setTreeBg, (state, { payload }) =>
    produce(state, setValue.treeBg(payload)),
  ),
  _(ac.setTreeColor, (state, { payload }) =>
    produce(state, setValue.treeColor(payload)),
  ),
  _(ac.setTreeFont, (state, { payload }) =>
    produce(state, setValue.treeFont(payload)),
  ),
  _(ac.setTreeFontSize, (state, { payload }) =>
    produce(state, setValue.treeFontSize(payload + 'px')),
  ),

  _(ac.setMonospaceBg, (state, { payload }) =>
    produce(state, setValue.setMonospaceBg(payload)),
  ),

  _(ac.resetToDefaults, state => produce(state, setValue.reset(undefined))),

  _(ac.undoChanges, state => {
    return state.previous
      ? {
          current: state.previous,
          previous: undefined,
        }
      : state;
  }),
]);

export {
  reducer as editorSettingsReducer,
  ac as editorSettingsActionCreators,
  State as EditorSettingsState,
};
