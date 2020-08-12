import * as React from 'react';
import { HotKey } from '::helpers/hotkeys/hotkeys-manager';
import { useCallback } from 'react';
import { ButtonSquare } from '::root/components/shared-components/buttons/button-square/button-square';
import { modButton, modHotKey } from '::sass-modules';
import { TextInput } from '::root/components/shared-components/form/text-input';
import { keyEventToValidShortcut } from '::root/components/app/components/menus/dialogs/settings/screens/keyboard-shortcuts/components/components/keyboard-shortcut/helpers';
import { hkActionCreators } from '::root/components/app/components/menus/dialogs/settings/screens/keyboard-shortcuts/components/reducer/reducer';
import { joinClassNames } from '::helpers/dom/join-class-names';

const enumToString = (word: string): string =>
  word.replace(/_/g, ' ').toLocaleLowerCase();

const onChange = () => undefined;
const KeyboardShortcut = ({
  hotKey: { keysCombination, type },
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
  return (
    <span
      className={joinClassNames([
        modHotKey.hotKey,
        [modHotKey.hotKeyDuplicate, duplicate],
      ])}
    >
      <span className={modHotKey.hotKey__name}>{enumToString(type)}</span>
      {keysCombination && (
        <span className={modHotKey.hotKey__keys}>
          <ButtonSquare
            className={`${
              keysCombination.ctrlKey ? modButton.buttonPressed : ''
            }`}
            onClick={toggleCtrl}
            text={'ctrl'}
          />
          <ButtonSquare
            className={`${
              keysCombination.altKey ? modButton.buttonPressed : ''
            }`}
            onClick={toggleAlt}
            text={'alt'}
          />
          <ButtonSquare
            className={`${
              keysCombination.shiftKey ? modButton.buttonPressed : ''
            }`}
            onClick={toggleShift}
            text={'shift'}
          />
          <TextInput
            topLevelClassName={modHotKey.hotKey__field}
            value={keysCombination.key === ' ' ? 'space' : keysCombination.key}
            onKeyUp={setKey}
            onChange={onChange}
          />
        </span>
      )}
    </span>
  );
};

export { KeyboardShortcut };
