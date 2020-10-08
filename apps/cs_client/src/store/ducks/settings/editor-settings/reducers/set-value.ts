import { EditorSettingsState } from '::store/ducks/settings/editor-settings/editor-settings';
import { getDefaultSettings } from '@cherryjuice/default-settings';
export const flatObjectEqual = <T>(a: T, b: T): boolean => {
  return Object.entries(a).every(([key, value]) => {
    return b[key] === value || (!b[key] && !value);
  });
};

export const previousify = <T>(
  state: { previous: T; current: T },
  mutation: () => void,
) => {
  if (!state.previous) state.previous = { ...state.current };
  mutation();
  const isOriginalState = flatObjectEqual(state.current, state.previous);
  if (isOriginalState) state.previous = undefined;
};

const valueSetter = <T>(key: string | 'reset-all') => (value: T) => (
  state: EditorSettingsState,
): EditorSettingsState => {
  previousify(state, () => {
    if (key === 'reset-all') {
      state.current = getDefaultSettings().editorSettings;
    } else state.current[key] = value;
  });

  return state;
};

export const setValue = {
  reset: valueSetter<undefined>('reset-all'),
  setMonospaceBg: valueSetter<string>('monospaceBg'),

  codeBg: valueSetter<string>('codeBg'),
  codeFont: valueSetter<string>('codeFont'),
  codeFontSize: valueSetter<string>('codeFontSize'),

  richTextBg: valueSetter<string>('richTextBg'),
  richTextColor: valueSetter<string>('richTextColor'),
  richTextFont: valueSetter<string>('richTextFont'),
  richTextFontSize: valueSetter<string>('richTextFontSize'),

  treeBg: valueSetter<string>('treeBg'),
  treeColor: valueSetter<string>('treeColor'),
  treeFont: valueSetter<string>('treeFont'),
  treeFontSize: valueSetter<string>('treeFontSize'),
};
