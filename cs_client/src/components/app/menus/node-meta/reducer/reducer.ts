import { NodeCached } from '::types/graphql-adapters';
import { calculateState } from '::app/menus/node-meta/helpers/calculate-state';
import { QNodeMeta } from '::graphql/queries/query-document';
import { NodeOwnerOt } from '::types/graphql/generated';

const initialState = {
  name: '',
  customColor: '#ffffff',
  hasCustomColor: false,
  customIcon: '0',
  hasCustomIcon: false,
  isBold: false,
  isReadOnly: false,
  owner: NodeOwnerOt,
};

type ResetToCreateProps = {
  fatherNode?: QNodeMeta;
};
const resetToCreate = ({ fatherNode }: ResetToCreateProps): TState => {
  return {
    ...initialState,
    owner: fatherNode?.owner,
  };
};
type ResetToEditProps = {
  node: QNodeMeta;
};
const resetToEdit = ({ node }: ResetToEditProps): TState => {
  return {
    ...initialState,
    owner: calculateState(node as NodeCached),
  };
};
type TState = typeof initialState;

enum actions {
  setName,
  setCustomColor,
  setHasCustomColor,
  setCustomIcon,
  setHasCustomIcon,
  setIsBold,
  setIsReadOnly,
  resetToEdit,
  resetToCreate,
}

const actionCreators = (() => {
  const state = {
    dispatch: undefined,
  };
  return {
    __setDispatch: dispatch => (state.dispatch = dispatch),
    setName: value => state.dispatch({ type: actions.setName, value }),
    setCustomColor: value =>
      state.dispatch({ type: actions.setCustomColor, value }),
    setHasCustomColor: value =>
      state.dispatch({ type: actions.setHasCustomColor, value }),
    setCustomIcon: value =>
      state.dispatch({ type: actions.setCustomIcon, value }),
    setHasCustomIcon: value =>
      state.dispatch({ type: actions.setHasCustomIcon, value }),
    setIsBold: value => state.dispatch({ type: actions.setIsBold, value }),
    setIsReadOnly: value =>
      state.dispatch({ type: actions.setIsReadOnly, value }),
    resetToEdit: (value: ResetToEditProps) =>
      state.dispatch({ type: actions.resetToEdit, value }),
    resetToCreate: (value: ResetToCreateProps) =>
      state.dispatch({ type: actions.resetToCreate, value }),
  };
})();

const reducer = (
  state: TState,
  action: {
    type: actions;
    value: any;
  },
): TState => {
  switch (action.type) {
    case actions.setCustomColor:
      return { ...state, customColor: action.value };
    case actions.setCustomIcon:
      return { ...state, customIcon: action.value };
    case actions.setHasCustomColor:
      return { ...state, hasCustomColor: action.value };
    case actions.setHasCustomIcon:
      return { ...state, hasCustomIcon: action.value };
    case actions.setIsBold:
      return { ...state, isBold: action.value };
    case actions.setIsReadOnly:
      return { ...state, isReadOnly: action.value };
    case actions.setName:
      return { ...state, name: action.value };
    case actions.resetToEdit:
      return resetToEdit(action.value);
    case actions.resetToCreate:
      return resetToCreate(action.value);
    default:
      throw new Error(action.type + ' action not supported');
  }
};

export {
  actionCreators as nodeMetaActionCreators,
  initialState as nodeMetaInitialState,
  reducer as nodeMetaReducer,
  TState as TNodeMetaState,
};
