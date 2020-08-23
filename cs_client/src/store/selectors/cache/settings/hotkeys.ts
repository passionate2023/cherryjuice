import { Store } from '::store/store';
import { HotKeys } from '::types/graphql/generated';
import { createSelector } from 'reselect';
import { HotKey } from '::types/graphql/generated';

const hotKeysSelector = (state: Store) => state.auth.settings.hotKeys;
const updatedHotKeys = (state: Store) => state.cache.settings.hotKeys;

const findHotKey = (hkx: HotKey) => (hkn: HotKey): boolean =>
  hkn.type === hkx.type;

export const getHotkeys = createSelector(
  hotKeysSelector,
  updatedHotKeys,
  (current, updatedHotKeys): HotKeys => {
    const existingFormattingHotKeys = current.formatting;
    const existingGeneralHotKeys = current.general;
    Object.entries(updatedHotKeys).forEach(hotKeys => {
      (Object.values(hotKeys) as HotKey[]).forEach(hotKey => {
        let i = existingFormattingHotKeys.findIndex(findHotKey(hotKey));
        if (i !== -1) {
          current.formatting[i] = hotKey;
        } else {
          i = existingGeneralHotKeys.findIndex(findHotKey(hotKey));
          current.general[i] = hotKey;
        }
      });
    });
    return { ...current };
  },
);
