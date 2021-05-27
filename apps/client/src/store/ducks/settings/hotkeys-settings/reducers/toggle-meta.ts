import { HotKeyActionType } from '@cherryjuice/graphql-types';
import { HotkeysSettingsState } from '::store/ducks/settings/hotkeys-settings/hotkeys-settings';
import { previousify } from '::store/ducks/settings/editor-settings/reducers/set-value';

export enum MetaKey {
  ctrl = 'ctrl',
  shift = 'shift',
  alt = 'alt',
}

const metaKeysPositions = {
  [MetaKey.ctrl]: 2,
  [MetaKey.alt]: 1,
  [MetaKey.shift]: 0,
};

export type ToggleMetaKeyProps = { type: HotKeyActionType; key: MetaKey };
export const toggleMetaKey = (
  state: HotkeysSettingsState,
  { type, key }: ToggleMetaKeyProps,
): HotkeysSettingsState => {
  previousify(state, () => {
    const currentComb = state.current[type];
    const length = currentComb.length;
    const flagPosition = length - metaKeysPositions[key] - 1;
    let newComb = '';
    for (let i = 0; i < length; i++) {
      if (i === flagPosition) {
        newComb += +!+currentComb[i];
      } else newComb += currentComb[i];
    }
    state.current[type] = newComb;
  });
  return state;
};
