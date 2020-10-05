import { EditorSettings } from '../editor-settings';

export const getDefaultEditorSettings = (): EditorSettings => ({
  version: 1.0,
  monospaceBg: '#2b2b2b',
  codeBg: '#483D8B',
  codeFont: 'Verdana',
  codeFontSize: '22px',
  richTextBg: '#000000',
  richTextColor: '#ffffff',
  richTextFont: 'Verdana',
  richTextFontSize: '22px',
  treeBg: '#000000',
  treeColor: '#ffffff',
  treeFont: 'Verdana',
  treeFontSize: '18px',
});
