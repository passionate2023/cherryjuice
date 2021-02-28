import * as React from 'react';
import { KeyboardShortcut } from '::root/components/app/components/menus/dialogs/settings/screens/keyboard-shortcuts/components/components/keyboard-shortcut/keyboard-shortcut';
import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::store/store';
import { modHotKeys } from '::sass-modules';
import { getHotkeys } from '::store/selectors/cache/settings/hotkeys';

const mapState = (state: Store) => ({
  hotKeys: getHotkeys(state),
  current: state.hotkeySettings.current,
  duplicates: state.hotkeySettings.duplicates,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const KeyboardShortcuts: React.FC<PropsFromRedux> = ({
  hotKeys,
  current,
  duplicates,
}) => {
  return (
    <>
      {Object.entries(hotKeys).map(([name, hotkeys]) => (
        <div key={name} className={modHotKeys.hotkeys__category}>
          <div className={modHotKeys.hotkeys__category__nameContainer}>
            <div className={modHotKeys.hotkeys__category__name}>{name}</div>
          </div>
          <div className={modHotKeys.hotkeys__category__hotkeysList}>
            {hotkeys.map(
              ({ type }) =>
                current[type] && (
                  <KeyboardShortcut
                    key={type}
                    hotKey={{ type, keys: current[type] }}
                    duplicate={duplicates && duplicates[type]}
                  />
                ),
            )}
          </div>
        </div>
      ))}
    </>
  );
};

const _ = connector(KeyboardShortcuts);
export { _ as KeyboardShortcuts };
