import { Settings } from '@cherryjuice/graphql-types';
import { getDefaultEditorSettings } from './default-editor-settings';
import { getDefaultHotkeys } from './get-default-hot-keys';

export const getDefaultSettings = (): Settings => ({
  editorSettings: getDefaultEditorSettings(),
  hotKeys: getDefaultHotkeys(),
});
