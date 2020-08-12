import { HotKey, KeysCombination } from '::helpers/hotkeys/hotkeys-manager';

const findDuplicates = arr => arr.filter((e, i, a) => a.indexOf(e) !== i);
const flattenHotKey = (value: KeysCombination | KeyboardEvent) =>
  value.key +
  Number(value.ctrlKey || 0) +
  Number(value.altKey || 0) +
  Number(value.shiftKey || 0);

const findDuplicateHotkeys = (hotKeys: HotKey[]) =>
  findDuplicates(
    hotKeys.map(hk =>
      hk.keysCombination ? flattenHotKey(hk.keysCombination) : undefined,
    ),
  ).filter(Boolean);

export { findDuplicates, flattenHotKey, findDuplicateHotkeys };
