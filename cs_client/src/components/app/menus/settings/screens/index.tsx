import { keyboardShortcutsScreen } from '::app/menus/settings/screens/keyboard-shortcuts';
import * as React from 'react';
import modSettings from '::sass-modules/settings/settings.scss';
const screens = {
  ...keyboardShortcutsScreen,
  ...{
    Typography: <div className={modSettings.settings__screen}></div>,
  },
};

export { screens };
