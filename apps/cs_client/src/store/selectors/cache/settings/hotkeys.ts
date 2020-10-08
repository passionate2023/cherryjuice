import { Store } from '::store/store';
import { HotKey, HotKeys } from '@cherryjuice/graphql-types';
import { createSelector } from 'reselect';

const hotKeysSelector = (state: Store) => state.hotkeySettings.current;

export const getHotkeys = createSelector(
  hotKeysSelector,
  (current): HotKeys => {
    const hks = Object.entries(current).map(([type, keys]) => ({
      type,
      keys,
    })) as HotKey[];
    return {
      formatting: hks.slice(0, 21),
      general: hks.slice(21),
    };
  },
);
