import { keyboardShortcutsScreen } from '::app/menus/settings/screens/keyboard-shortcuts';
import { DrawerScreens } from '::shared-components/drawer/drawer';
import { groupScreensByName } from '::shared-components/drawer/helpers/group-screens-by-name';
import { personalInformationScreen } from '::app/menus/settings/screens/account/manage-account';

const screens: DrawerScreens = groupScreensByName([
  personalInformationScreen,
  keyboardShortcutsScreen,
]);

export { screens };
