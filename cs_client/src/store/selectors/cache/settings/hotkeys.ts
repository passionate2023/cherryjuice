import { Store } from '::store/store';
import { UserHotkeys } from '::helpers/hotkeys/fetched';
import { createSelector } from 'reselect';

const hotKeysSelector = (state: Store) => state.auth.settings.hotKeys;
const updatedHotKeys = (state: Store) => state.cache.settings.hotKeys;

export const getHotkeys = createSelector(
  hotKeysSelector,
  updatedHotKeys,
  (current, updatedHotKeys): UserHotkeys => {
    return {
      formatting: {
        ...current.formatting,
        hotkeys: {
          ...current.formatting.hotkeys,
          ...updatedHotKeys.formatting,
        },
      },
      document: {
        ...current.document,
        hotkeys: {
          ...current.document.hotkeys,
          ...updatedHotKeys.document,
        },
      },
    };
  },
);
