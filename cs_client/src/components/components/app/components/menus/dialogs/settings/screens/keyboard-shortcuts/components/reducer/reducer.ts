import { HotKey } from '::helpers/hotkeys/hotkeys-manager';
import { UserHotkeys } from '::helpers/hotkeys/fetched';
import { HotKeyActionType } from '::helpers/hotkeys/types';

const compose = (...fns) => {
  if (fns.length === 0) return arg => arg;
  if (fns.length === 1) return fns[0];
  return fns.reduce((a, b) => (...args) => a(b(...args)));
};

type State = {
  hotKeys: Record<HotKeyActionType, HotKey>;
  duplicateHotkeys: Record<HotKeyActionType, true>;
};
const initialState: State = {
  hotKeys: undefined,
  duplicateHotkeys: undefined,
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
    duplicateHotkeys: {},
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
    setKey: (value: { type: HotKeyActionType; key: string }) => {
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
const fn = (
  state: State,
  action: { type: actions; value: HotKeyActionType },
) => (key: string): State => {
  return {
    ...state,
    hotKeys: {
      ...state.hotKeys,
      [action.value]: {
        ...state.hotKeys[action.value],
        keysCombination: {
          ...state.hotKeys[action.value].keysCombination,
          [key]: !state.hotKeys[action.value].keysCombination[key],
        },
      },
    },
  };
};
const reducer = (
  state: State,
  action: {
    type: actions;
    value: any;
  },
): State => {
  switch (action.type) {
    case actions.setKey:
      return {
        ...state,
        hotKeys: {
          ...state.hotKeys,
          [action.value.type]: {
            ...state.hotKeys[action.value.type],
            keysCombination: {
              ...state.hotKeys[action.value.type].keysCombination,
              key: action.value.key,
            },
          },
        },
      };
    case actions.toggleCtrl:
      return fn(state, action)('ctrlKey');
    case actions.toggleAlt:
      return fn(state, action)('altKey');
    case actions.toggleShift:
      return fn(state, action)('shiftKey');
    case actions.setDuplicateHotkeys:
      return {
        ...state,
        // @ts-ignore
        duplicateHotkeys: Object.fromEntries(
          action.value.map(type => [type, true]),
        ),
      };
    case actions.reset:
      return resetState(action.value);
    default:
      throw new Error(action.type + ' action not supported');
  }
};

export {
  actionCreators as hkActionCreators,
  initialState as hkInitialState,
  reducer as hkReducer,
  resetState as resetHKState,
  State as HKState,
};
