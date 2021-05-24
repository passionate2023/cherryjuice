import { keyboardShortcutsScreen } from '::root/components/app/components/menus/dialogs/settings/screens/keyboard-shortcuts/keyboard-shortcuts-screen';
import { DrawerScreens } from '::root/components/shared-components/drawer/drawer';
import { groupScreensByName } from '::root/components/shared-components/drawer/helpers/group-screens-by-name';
import { accountScreen } from '::root/components/app/components/menus/dialogs/settings/screens/account/account';
import { editorScreen } from '::root/components/app/components/menus/dialogs/settings/screens/editor/editor-screen';
import { aboutScreen } from '::app/components/menus/dialogs/settings/screens/about/about-screen';

enum ScreenName {
  KeyboardShortcuts = 'keyboard shortcuts',
  ManageAccount = 'manage account',
  Editor = 'editor',
}

const screens: DrawerScreens = groupScreensByName([
  accountScreen,
  keyboardShortcutsScreen,
  editorScreen,
  aboutScreen,
]);

export { screens };
export { ScreenName };
