import { KeysCombination } from '::helpers/hotkeys/hotkeys-manager';
import { HotKey } from '::types/graphql/generated';

const flattenHotKey = (value: KeysCombination | KeyboardEvent) =>
  value.key +
  Number(value.ctrlKey || 0) +
  Number(value.altKey || 0) +
  Number(value.shiftKey || 0);

const flattenHotKeys = (hotKeys: HotKey[]): string[] =>
  hotKeys.map(hk => (hk.keys ? hk.keys : undefined));

export { flattenHotKeys, flattenHotKey };