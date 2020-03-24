import modSettings from '::sass-modules/settings/settings.scss';
import { commands } from '::helpers/hotkeys/commands';
import * as React from 'react';
import { KeyboardShortcut } from '::app/menus/settings/screens/keyboard-shortcuts/keyboard-shortcut';

const keyboardShortcutsScreen = {
  'Keyboard Shortcuts': (
    <div className={modSettings.settings__screen}>
      {[...commands.colors, ...commands.tagsAndStyles].map(
        ({ name, hotKey }) =>
          hotKey && <KeyboardShortcut key={name} name={name} hotkey={hotKey} />,
      )}
    </div>
  ),
};

export { keyboardShortcutsScreen };
