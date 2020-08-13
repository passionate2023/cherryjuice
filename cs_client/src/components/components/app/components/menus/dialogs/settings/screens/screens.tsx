import { keyboardShortcutsScreen } from '::root/components/app/components/menus/dialogs/settings/screens/keyboard-shortcuts/keyboard-shortcuts-screen';
import { DrawerScreens } from '::root/components/shared-components/drawer/drawer';
import { groupScreensByName } from '::root/components/shared-components/drawer/helpers/group-screens-by-name';
import { accountScreen } from '::root/components/app/components/menus/dialogs/settings/screens/account/account';
type ScreenName = 'keyboard shortcuts' | 'manage account';
const screens: DrawerScreens = groupScreensByName([
  accountScreen,
  keyboardShortcutsScreen,
]);

export { screens };
export { ScreenName };
