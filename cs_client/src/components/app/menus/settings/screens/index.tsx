import { keyboardShortcutsScreen } from '::app/menus/settings/screens/keyboard-shortcuts';
import { DrawerScreens } from '::shared-components/drawer/drawer';
import { groupScreensByName } from '::shared-components/drawer/helpers/group-screens-by-name';

const screens: DrawerScreens = groupScreensByName([keyboardShortcutsScreen]);

export { screens };
