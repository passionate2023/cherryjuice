import { HotKey, KeysCombination } from '::helpers/hotkeys/hotkeys-manager';

const findDuplicate = <T>(arr: T[]): { index: number } => {
  let index;
  for (let i = 0; i < arr.length; i++) {
    const duplicateIndex = arr.indexOf(arr[i]);
    if (duplicateIndex !== i) {
      index = duplicateIndex;
    }
  }
  return { index };
};
const flattenHotKey = (value: KeysCombination | KeyboardEvent) =>
  value.key +
  Number(value.ctrlKey || 0) +
  Number(value.altKey || 0) +
  Number(value.shiftKey || 0);

const flattenHotKeys = (hotKeys: HotKey[]): string[] =>
  hotKeys.map(hk =>
    hk.keysCombination ? flattenHotKey(hk.keysCombination) : undefined,
  );

const findDuplicateHotkeys = (hotKeys: HotKey[]): HotKey => {
  const { index } = findDuplicate(
    flattenHotKeys(hotKeys)
      .filter(Boolean)
  );
  return hotKeys[index];
};

export { flattenHotKeys, findDuplicate, flattenHotKey, findDuplicateHotkeys };
