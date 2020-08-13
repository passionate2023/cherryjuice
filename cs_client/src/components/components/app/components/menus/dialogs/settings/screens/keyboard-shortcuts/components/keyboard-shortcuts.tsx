import * as React from 'react';
import { KeyboardShortcut } from '::root/components/app/components/menus/dialogs/settings/screens/keyboard-shortcuts/components/components/keyboard-shortcut/keyboard-shortcut';
import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::store/store';
import {
  hkActionCreators,
  hkReducer,
  resetHKState,
} from '::root/components/app/components/menus/dialogs/settings/screens/keyboard-shortcuts/components/reducer/reducer';
import { useEffect, useReducer } from 'react';
import { UserHotkeys } from '::helpers/hotkeys/fetched';
import { modHotKeys } from '::sass-modules';

const mapState = (state: Store) => ({
  userHotKeys: state.auth.settings?.hotKeys as UserHotkeys,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const KeyboardShortcuts: React.FC<Props & PropsFromRedux> = ({
  userHotKeys,
}) => {
  const [state, dispatch] = useReducer(hkReducer, {}, () => {
    return resetHKState(userHotKeys);
  });
  useEffect(() => {
    hkActionCreators.init(dispatch);
  }, []);

  useEffect(() => {
    hkActionCreators.reset(userHotKeys);
  }, [userHotKeys]);
  return (
    <>
      {Object.entries(userHotKeys).map(([, { hotkeys, meta }]) => (
        <div key={meta.name} className={modHotKeys.hotkeys__category}>
          <div className={modHotKeys.hotkeys__category__name}>{meta.name}</div>
          <div className={modHotKeys.hotkeys__category__hotkeysList}>
            {hotkeys.map(({ type }) => (
              <KeyboardShortcut
                key={type}
                hotKey={state.hotKeys[type]}
                duplicate={state.duplicates && state.duplicates[type]}
              />
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

const _ = connector(KeyboardShortcuts);
export { _ as KeyboardShortcuts };
