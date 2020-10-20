import { Store } from '::store/store';
import { HotKey, HotKeys } from '@cherryjuice/graphql-types';
import { createSelector } from 'reselect';
import { generalHotKeysProps } from '::helpers/hotkeys/hot-key-props/general-hotkeys-props';

const hotKeysSelector = (state: Store) => state.hotkeySettings.current;

export const getHotkeys = createSelector(
  hotKeysSelector,
  (current): HotKeys => {
    const hks = Object.entries(current).map(([type, keys]) => ({
      type,
      keys,
    })) as HotKey[];

    const [formatting, general] = hks.reduce(
      (groups, hk) => {
        if (generalHotKeysProps[hk.type]) groups[1].push(hk);
        else groups[0].push(hk);
        return groups;
      },
      [[], []],
    );
    return {
      formatting,
      general,
    };
  },
);
