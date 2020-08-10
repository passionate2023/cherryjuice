import { keyboardShortcutsScreen } from '::root/components/app/components/menus/dialogs/settings/screens/keyboard-shortcuts';
import { DrawerScreens } from '::root/components/shared-components/drawer/drawer';
import { groupScreensByName } from '::root/components/shared-components/drawer/helpers/group-screens-by-name';
import { personalInformationScreen } from '::root/components/app/components/menus/dialogs/settings/screens/account/manage-account';

const screens: DrawerScreens = groupScreensByName([
  personalInformationScreen,
  keyboardShortcutsScreen,
]);

export { screens };
