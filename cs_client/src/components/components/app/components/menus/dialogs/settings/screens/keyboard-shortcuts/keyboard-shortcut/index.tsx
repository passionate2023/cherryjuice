import modKeyboardShortcut from '::sass-modules/settings/keyboard-shortcut.scss';
import modSettings from '::sass-modules/settings/settings.scss';
import * as React from 'react';
import { ButtonSquare } from '::root/components/shared-components/buttons/button-square/button-square';
import { TextInput } from '::root/components/shared-components/form/text-input';
import { modButton } from '::sass-modules';
import { useState } from 'react';
import { HotKeyKeys } from '::helpers/hotkeys/helpers/hotkeys-manager';

const MetaKey: React.FC<{
  label: string;
  isPressed: boolean;
}> = ({ label, isPressed }) => {
  const [pressed, setPressed] = useState(() => isPressed);
  return (
    <ButtonSquare
      className={`${pressed ? modButton.buttonPressed : ''}`}
      key={label}
      onClick={() => setPressed(!pressed)}
      text={label}
    />
  );
};

const keyEventToValidShortcut = (data: string) => {
  const isWord = /^[a-z]$/.test(data.toLowerCase());
  if (isWord) return data;

  const isSpace = ' ' === data;
  if (isSpace) return 'space';

  const isDigit = /[0-9]/.test(data);
  if (isDigit) return `Digit${data}`;

  const isArrowKey = /Arrow.{2,5}/.test(data);
  if (isArrowKey) return data;

  return '';
};

const KeyboardKey = ({ initialValue }) => {
  const [value, setValue] = useState(() => initialValue);
  return (
    <TextInput
      topLevelClassName={modKeyboardShortcut.keyboardShortcut__field}
      value={value}
      onKeyUp={e => {
        setValue(keyEventToValidShortcut(e.nativeEvent.key) || value);
      }}
      onChange={() => undefined}
    />
  );
};
const KeyboardShortcut = ({
  name,
  hotkey: { shiftKey, ctrlKey, altKey, key, code },
}: {
  name: string;
  hotkey: HotKeyKeys;
}) => (
  <span className={modSettings.settings__settingElement}>
    <span className={modSettings.settings__settingElement__name}>{name}</span>
    <span className={modSettings.settings__settingElement__value}>
      {[
        { label: `${'ctrl'}`, isPressed: ctrlKey },
        { label: `${'alt'}`, isPressed: altKey },
        { label: `${'shift'}`, isPressed: shiftKey },
      ].map(({ label, isPressed }, i) => (
        <MetaKey key={label + i} label={label} isPressed={isPressed} />
      ))}
      <KeyboardKey
        initialValue={`${key ? (key === ' ' ? 'space' : key) : code}`}
      />
    </span>
  </span>
);

export { KeyboardShortcut };
