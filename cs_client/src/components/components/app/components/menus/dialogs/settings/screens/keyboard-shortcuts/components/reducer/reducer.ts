import { HotKey, KeysCombination } from '::helpers/hotkeys/hotkeys-manager';
import { UserHotkeys } from '::helpers/hotkeys/fetched';
import { HotKeyActionType } from '::helpers/hotkeys/types';
import {
  findDuplicateHotkeys,
  flattenHotKey,
} from '::root/components/app/components/menus/dialogs/settings/screens/keyboard-shortcuts/components/helpers/find-duplicate';

const compose = (...fns) => {
  if (fns.length === 0) return arg => arg;
  if (fns.length === 1) return fns[0];
  return fns.reduce((a, b) => (...args) => a(b(...args)));
};

type HotKeyDict = Record<HotKeyActionType, HotKey>;
type HotKeyChangesDict = Record<
  HotKeyActionType,
  { original: KeysCombination; changed: KeysCombination }
>;
type DuplicateHotKeys = Record<HotKeyActionType, true>;
type State = {
  changes: HotKeyChangesDict;
  hotKeys: HotKeyDict;
  duplicates?: DuplicateHotKeys;
};
const initialState: State = {
  changes: undefined,
  hotKeys: undefined,
  duplicates: undefined,
};

type ResetStateProps = UserHotkeys;
const resetState = (userHotKeys: ResetStateProps): State => {
  return {
    hotKeys: Object.fromEntries(
      [
        ...userHotKeys.formatting.hotkeys,
        ...userHotKeys.document.hotkeys,
      ].map(hk => [hk.type, hk]),
    ),
    duplicates: undefined,
    changes: {},
  } as State;
};

enum actions {
  toggleCtrl,
  reset,
  toggleAlt,
  toggleShift,
  setKey,
  setDuplicateHotkeys,
}

type SetKeyPayload = { type: HotKeyActionType; key: string };
const actionCreators = (() => {
  const state = {
    dispatch: undefined,
    enhancedDispatch: undefined,
  };
  return {
    init(dispatch, middleware: Function[] = []) {
      state.dispatch = dispatch;
      const chain = middleware.map(middleware => middleware(state));
      state.enhancedDispatch = compose(...chain)(state.dispatch);
    },
    setKey: (value: SetKeyPayload) => {
      if (value.key) state.dispatch({ type: actions.setKey, value });
    },
    toggleCtrl: (value: HotKeyActionType) =>
      state.enhancedDispatch({ type: actions.toggleCtrl, value }),
    toggleAlt: (value: HotKeyActionType) =>
      state.enhancedDispatch({ type: actions.toggleAlt, value }),
    toggleShift: (value: HotKeyActionType) =>
      state.enhancedDispatch({ type: actions.toggleShift, value }),
    setDuplicateHotkeys: (value: HotKeyActionType[]) =>
      state.enhancedDispatch({ type: actions.setDuplicateHotkeys, value }),
    reset: (value: UserHotkeys) =>
      state.enhancedDispatch({ type: actions.reset, value }),
  };
})();

const toggleMetaKey = (
  state: State,
  action: { type: actions; value: HotKeyActionType },
) => (key: string): HotKey => {
  return {
    ...state.hotKeys[action.value],
    keysCombination: {
      ...state.hotKeys[action.value].keysCombination,
      [key]: !state.hotKeys[action.value].keysCombination[key],
    },
  };
};

const updateKey = (state: State) => ({ type, key }: SetKeyPayload): HotKey => {
  return {
    ...state.hotKeys[type],
    keysCombination: {
      ...state.hotKeys[type].keysCombination,
      key,
    },
  };
};

const mergeHotKey = (
  state: State,
  newHotKey: HotKey,
): State => {
  return {
    ...state,
    hotKeys: {
      ...state.hotKeys,
      [newHotKey.type]: newHotKey,
    },
  };
};

const calculateChanges = (
  state: State,
  newHotKey: HotKey,
): HotKeyChangesDict => {
  const changes = state.changes;
  const previousValue = changes[newHotKey.type];
  let equal: boolean;
  if (previousValue) {
    equal =
      flattenHotKey(previousValue.original) ===
      flattenHotKey(newHotKey.keysCombination);
  }
  if (equal) delete changes[newHotKey.type];
  else
    changes[newHotKey.type] = {
      original: previousValue
        ? previousValue.original
        : state.hotKeys[newHotKey.type].keysCombination,
      changed: newHotKey.keysCombination,
    };

  return { ...changes };
};

const findDuplicateHotKeys = (state: State): DuplicateHotKeys | undefined => {
  const hotKeys = Object.values(state.hotKeys);
  const duplicateHotKey = findDuplicateHotkeys(hotKeys);
  if (duplicateHotKey) {
    const flatDuplicate = flattenHotKey(duplicateHotKey.keysCombination);
    const duplicateHotKeys = hotKeys.filter(
      hk =>
        hk.keysCombination &&
        flattenHotKey(hk.keysCombination) === flatDuplicate,
    );
    duplicateHotKeys.push(duplicateHotKey);
    return Object.fromEntries(
      duplicateHotKeys.map(hk => [hk.type, true]),
    ) as DuplicateHotKeys;
  }
};

const reducer = (
  state: State,
  action: {
    type: actions;
    value: any;
  },
): State => {
  let newHotKey;
  if (action.type === actions.setKey) {
    newHotKey = updateKey(state)(action.value as SetKeyPayload);
  } else if (action.type === actions.toggleCtrl) {
    newHotKey = toggleMetaKey(state, action)('ctrlKey');
  } else if (action.type === actions.toggleAlt) {
    newHotKey = toggleMetaKey(state, action)('altKey');
  } else if (action.type === actions.toggleShift) {
    newHotKey = toggleMetaKey(state, action)('shiftKey');
  } else if (action.type === actions.reset) {
    return resetState(action.value);
  } else {
    throw new Error(action.type + ' action not supported');
  }
  const changes = calculateChanges(state, newHotKey);
  state = mergeHotKey(state, newHotKey);
  const duplicates = findDuplicateHotKeys(state);
  return { ...state, duplicates: duplicates, changes };
};

export {
  actionCreators as hkActionCreators,
  initialState as hkInitialState,
  reducer as hkReducer,
  resetState as resetHKState,
  State as HKState,
};
