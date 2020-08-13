import modSettings from '::sass-modules/settings/settings.scss';
import * as React from 'react';
import { DrawerScreen } from '::root/components/shared-components/drawer/drawer';
import { KeyboardShortcuts } from '::root/components/app/components/menus/dialogs/settings/screens/keyboard-shortcuts/components/keyboard-shortcuts';

const keyboardShortcutsScreen: DrawerScreen = {
  name: 'keyboard shortcuts',
  category: 'app',
  element: (
    <div className={modSettings.settings__screen}>
      <KeyboardShortcuts />
    </div>
  ),
};

export { keyboardShortcutsScreen };
