import * as React from 'react';
import { useCallback, useMemo } from 'react';
import { KeysCombination } from '@cherryjuice/hotkeys';
import { ButtonSquare } from '@cherryjuice/components';
import { modHotKey } from '::sass-modules';
import { TextInput } from '::root/components/shared-components/form/text-input';
import { keyEventToValidShortcut } from '::app/components/menus/dialogs/settings/screens/keyboard-shortcuts/components/helpers/helpers';
import { joinClassNames } from '@cherryjuice/shared-helpers';
import { HotKey } from '@cherryjuice/graphql-types';
import { ac } from '::store/store';
import { MetaKey } from '::store/ducks/settings/hotkeys-settings/reducers/toggle-meta';

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
  const toggleCtrl = useCallback(
    () => ac.hotkeySettings.toggleMeta({ type, key: MetaKey.ctrl }),
    [],
  );
  const toggleShift = useCallback(
    () => ac.hotkeySettings.toggleMeta({ type, key: MetaKey.shift }),
    [],
  );
  const toggleAlt = useCallback(
    () => ac.hotkeySettings.toggleMeta({ type, key: MetaKey.alt }),
    [],
  );
  const setKey = useCallback(
    e =>
      ac.hotkeySettings.setKey({
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
          <ButtonSquare active={ctrlKey} onClick={toggleCtrl} text={'ctrl'} />
          <ButtonSquare active={altKey} onClick={toggleAlt} text={'alt'} />
          <ButtonSquare
            active={shiftKey}
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
