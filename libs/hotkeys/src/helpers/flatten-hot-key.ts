import { KeysCombination } from '::root/hotkeys-manager';
import { HotKey } from '@cherryjuice/graphql-types';

const flattenHotKey = (value: KeysCombination | KeyboardEvent) =>
  value?.key?.toLocaleLowerCase() +
  Number(value.ctrlKey || 0) +
  Number(value.altKey || 0) +
  Number(value.shiftKey || 0);

const flattenHotKeys = (hotKeys: HotKey[]): string[] =>
  hotKeys.map(hk => (hk.keys ? hk.keys : undefined));

export { flattenHotKeys, flattenHotKey };
