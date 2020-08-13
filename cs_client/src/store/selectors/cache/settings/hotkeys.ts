import { Store } from '::store/store';
import { UserHotkeys } from '::helpers/hotkeys/fetched';
import { createSelector } from 'reselect';
import { HotKey } from '::helpers/hotkeys/hotkeys-manager';

const hotKeysSelector = (state: Store) => state.auth.settings.hotKeys;
const updatedHotKeys = (state: Store) => state.cache.settings.hotKeys;

export const getHotkeys = createSelector(
  hotKeysSelector,
  updatedHotKeys,
  (current, updatedHotKeys): UserHotkeys => {
    Object.entries(updatedHotKeys).forEach(([category, hotKeys]) => {
      const existingHotKeys = current[category].hotkeys;
      (Object.values(hotKeys) as HotKey[]).forEach(hotKey => {
        const i = existingHotKeys.findIndex(hk => hk.type === hotKey.type);
        current[category].hotkeys[i] = hotKey;
      });
    });
    return current;
  },
);
