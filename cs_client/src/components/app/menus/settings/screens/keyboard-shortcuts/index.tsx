import modSettings from '::sass-modules/settings/settings.scss';
import * as React from 'react';
import { KeyboardShortcut } from '::app/menus/settings/screens/keyboard-shortcuts/keyboard-shortcut';
import { formattingHotKeys } from '::helpers/hotkeys/combinations/formatting';

const keyboardShortcutsScreen = {
  'Keyboard Shortcuts': (
    <div className={modSettings.settings__screen}>
      {[
        ...formattingHotKeys.colors,
        ...formattingHotKeys.tagsAndStyles,
        ...formattingHotKeys.misc,
      ].map(
        ({ name, hotKey }) =>
          hotKey && <KeyboardShortcut key={name} name={name} hotkey={hotKey} />,
      )}
    </div>
  ),
};

export { keyboardShortcutsScreen };
