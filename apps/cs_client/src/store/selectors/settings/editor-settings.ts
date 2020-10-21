import { Store } from '::store/store';
import { createSelector } from 'reselect';
import { getDefaultSettings } from '@cherryjuice/default-settings';
import { flatObjectEqual } from '::store/ducks/settings/editor-settings/reducers/set-value';
import { resetToDefault } from '::store/ducks/settings/hotkeys-settings/reducers/reset-to-default';

const getCurrentSettings = (state: Store) => state.editorSettings.current;

export const hasDefaultEditorSettings = createSelector(
  getCurrentSettings,
  currentSettings => {
    return flatObjectEqual(
      currentSettings,
      getDefaultSettings().editorSettings,
    );
  },
);
const getCurrentHotkeys = (state: Store) => state.hotkeySettings.current;
export const hasDefaulHotkeySettingsSettings = createSelector(
  getCurrentHotkeys,
  currentHotkeys => {
    const defaultHotkeys = resetToDefault({ current: undefined }).current;
    return flatObjectEqual(defaultHotkeys, currentHotkeys);
  },
);
