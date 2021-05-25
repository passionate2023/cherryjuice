import { previousify } from '::store/ducks/settings/editor-settings/reducers/set-value';
import { getDefaultSettings } from '@cherryjuice/default-settings';
import { HotkeysSettingsState } from '::store/ducks/settings/hotkeys-settings/hotkeys-settings';

export const resetToDefault = (
  state: HotkeysSettingsState,
): HotkeysSettingsState => {
  previousify(state, () => {
    state.current = Object.fromEntries([
      ...getDefaultSettings().hotKeys.formatting.map(hk => [hk.type, hk.keys]),
      ...getDefaultSettings().hotKeys.general.map(hk => [hk.type, hk.keys]),
    ]);
  });
  return state;
};
