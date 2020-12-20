import { HotKey, HotKeyActionType } from '@cherryjuice/graphql-types';

export type HotKeyDict = { [key in HotKeyActionType]?: string };
export const hotKeysToDict = (hotKeys: HotKey[]): HotKeyDict =>
  Object.fromEntries(hotKeys.map(hk => [hk.type, hk])) as HotKeyDict;
