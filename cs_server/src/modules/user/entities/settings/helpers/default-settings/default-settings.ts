import { Settings } from '../../settings.entity';
import { getDefaultEditorSettings } from '../../editor-settings/helpers/default-editor-settings';
import { getDefaultHotkeys } from '../../hot-keys/helpers/get-default-hot-keys';

export const getDefaultSettings = (): Settings => ({
  editorSettings: getDefaultEditorSettings(),
  hotKeys: getDefaultHotkeys(),
});
