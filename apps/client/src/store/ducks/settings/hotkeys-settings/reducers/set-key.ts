import { HotKeyActionType } from '@cherryjuice/graphql-types';
import { HotkeysSettingsState } from '::store/ducks/settings/hotkeys-settings/hotkeys-settings';
import { previousify } from '::store/ducks/settings/editor-settings/reducers/set-value';
export type SetKeyProps = { type: HotKeyActionType; key: string };

export const setKey = (
  state: HotkeysSettingsState,
  { type, key }: SetKeyProps,
) => {
  if (key) {
    previousify(state, () => {
      const currentHotkey = state.current[type];
      const length = currentHotkey.length;
      state.current[type] =
        key.toLowerCase() + currentHotkey.substring(length - 3);
    });
  }
  return state;
};
