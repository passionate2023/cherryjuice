import { HotKey } from '@cherryjuice/graphql-types';
import { HotkeysSettingsState } from '::store/ducks/settings/hotkeys-settings/hotkeys-settings';

const findDuplicate = <T>(arr: T[]): { index: number } => {
  let index;
  for (let i = 0; i < arr.length; i++) {
    const element = arr[i];
    if (element) {
      const duplicateIndex = arr.indexOf(element);
      if (duplicateIndex !== i) {
        index = duplicateIndex;
      }
    }
  }
  return { index };
};

const findDuplicateHotkeys = (hotKeys: HotKey[]): HotKey => {
  const { index } = findDuplicate(hotKeys.map(hk => hk.keys));
  return hotKeys[index];
};

export const calculateDuplicates = (
  state: HotkeysSettingsState,
): HotkeysSettingsState => {
  const hotKeys = Object.entries(state.current).map(([k, v]) => ({
    keys: v,
    type: k,
  })) as HotKey[];
  const duplicateHotKey = findDuplicateHotkeys(hotKeys);
  let duplicates = undefined;
  if (duplicateHotKey) {
    const flatDuplicate = duplicateHotKey.keys;
    const duplicateHotKeys = hotKeys.filter(hk => hk.keys === flatDuplicate);
    duplicateHotKeys.push(duplicateHotKey);
    duplicates = Object.fromEntries(
      duplicateHotKeys.map(hk => [hk.type, hk.keys]),
    );
  }
  state.duplicates = duplicates;
  return state;
};
