import * as React from 'react';
import { KeysCombination } from '::helpers/hotkeys/hotkeys-manager';
import { useCallback, useMemo } from 'react';
import { ButtonSquare } from '::root/components/shared-components/buttons/button-square/button-square';
import { modButton, modHotKey } from '::sass-modules';
import { TextInput } from '::root/components/shared-components/form/text-input';
import { keyEventToValidShortcut } from '::root/components/app/components/menus/dialogs/settings/screens/keyboard-shortcuts/components/components/keyboard-shortcut/helpers';
import { hkActionCreators } from '::root/components/app/components/menus/dialogs/settings/screens/keyboard-shortcuts/components/reducer/reducer';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { HotKey } from '::types/graphql/generated';

const keyToString = {
  ' ': 'space',
  arrowup: '↑',
  arrowdown: '↓',
  arrowleft: '←',
  arrowright: '→',
};
const mapKeyToString = (key: string): string => keyToString[key] || key;

const enumToString = (word: string): string =>
  word.replace(/_/g, ' ').toLocaleLowerCase();
const emptyCombination = {
  key: '',
  ctrlKey: false,
  altKey: false,
  shiftKey: false,
};
const unFlattenHotKey = (hotkey: string): KeysCombination => {
  const res = /^(.*)(\d{3})$/.exec(hotkey);
  if (res) {
    const meta = res[2];
    return {
      key: res[1],
      ctrlKey: Boolean(+meta[0]),
      altKey: Boolean(+meta[1]),
      shiftKey: Boolean(+meta[2]),
    };
  } else {
    return emptyCombination;
  }
};
const onChange = () => undefined;
const KeyboardShortcut = ({
  hotKey: { keys, type },
  duplicate,
}: {
  hotKey: HotKey;
  duplicate: boolean;
}) => {
  const toggleCtrl = useCallback(() => hkActionCreators.toggleCtrl(type), []);
  const toggleShift = useCallback(() => hkActionCreators.toggleShift(type), []);
  const toggleAlt = useCallback(() => hkActionCreators.toggleAlt(type), []);
  const setKey = useCallback(
    e =>
      hkActionCreators.setKey({
        type,
        key: keyEventToValidShortcut(e.nativeEvent.key),
      }),
    [],
  );
  const { ctrlKey, altKey, shiftKey, key } = useMemo(
    () => unFlattenHotKey(keys),
    [keys],
  );
  return (
    <span
      className={joinClassNames([
        modHotKey.hotKey,
        [modHotKey.hotKeyDuplicate, duplicate],
      ])}
    >
      <span className={modHotKey.hotKey__name}>{enumToString(type)}</span>
      {keys && (
        <span className={modHotKey.hotKey__keys}>
          <ButtonSquare
            className={`${ctrlKey ? modButton.buttonPressed : ''}`}
            onClick={toggleCtrl}
            text={'ctrl'}
          />
          <ButtonSquare
            className={`${altKey ? modButton.buttonPressed : ''}`}
            onClick={toggleAlt}
            text={'alt'}
          />
          <ButtonSquare
            className={`${shiftKey ? modButton.buttonPressed : ''}`}
            onClick={toggleShift}
            text={'shift'}
          />
          <TextInput
            topLevelClassName={modHotKey.hotKey__field}
            value={mapKeyToString(key)}
            onKeyUp={setKey}
            onChange={onChange}
          />
        </span>
      )}
    </span>
  );
};

export { KeyboardShortcut };
