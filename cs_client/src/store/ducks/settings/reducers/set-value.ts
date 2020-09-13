import {
  EditorSettingsState,
  Values,
} from '::store/ducks/settings/editor-settings';

const verifyReturnToStateZero = (a: Values, b: Values): boolean =>
  Object.entries(a).every(([key, value]) => b[key] === value);

const valueSetter = <T>(key: string) => (value: T) => (
  state: EditorSettingsState,
): EditorSettingsState => {
  if (!state.previous) state.previous = { ...state.current };
  state.current[key] = value;

  const isOriginalState = verifyReturnToStateZero(
    state.current,
    state.previous,
  );
  if (isOriginalState) state.previous = undefined;

  return state;
};

export const setValue = {
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
