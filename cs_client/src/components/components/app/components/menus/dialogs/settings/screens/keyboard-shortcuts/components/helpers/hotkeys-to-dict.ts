import { HotKey } from '::types/graphql/generated';
import { HotKeyDict } from '::root/components/app/components/menus/dialogs/settings/screens/keyboard-shortcuts/components/reducer/reducer';

export const hotKeysToDict = (hotKeys: HotKey[]): HotKeyDict =>
  Object.fromEntries(hotKeys.map(hk => [hk.type, hk])) as HotKeyDict;