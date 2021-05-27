import { calculateState } from '::root/components/app/components/menus/dialogs/node-meta/helpers/calculate-state';
import { QNodeMeta } from '::graphql/queries/document-meta';
import { NodePrivacy } from '@cherryjuice/graphql-types';

type TState = {
  name: string;
  customColor: string;
  customIcon: number;
  isBold: boolean;
  isReadOnly: boolean;
  privacy: NodePrivacy;
  tags: string[];
  nodeDepth: number;
};
const initialState: TState = {
  name: '',
  customColor: '#ffffff',
  customIcon: 0,
  isBold: false,
  isReadOnly: false,
  privacy: NodePrivacy.DEFAULT,
  tags: [],
  nodeDepth: 0,
};

type ResetToCreateProps = {
  fatherNode?: QNodeMeta;
};
const resetToCreate = ({ fatherNode }: ResetToCreateProps): TState => {
  return {
    ...initialState,
    privacy: fatherNode?.privacy || NodePrivacy.DEFAULT,
  };
};
type ResetToEditProps = {
  node: QNodeMeta;
  nodeDepth: number;
};
const resetToEdit = ({ node, nodeDepth }: ResetToEditProps): TState => {
  return calculateState(node, { nodeDepth });
};

enum actions {
  setName,
  setCustomColor,
  setCustomIcon,
  toggleBold,
  toggleIsReadOnly,
  resetToEdit,
  resetToCreate,
  setPrivacy,
  addTag,
  removeTag,
}

const actionCreators = (() => {
  const state = {
    dispatch: undefined,
  };
  return {
    init: dispatch => (state.dispatch = dispatch),
    setName: value => state.dispatch({ type: actions.setName, value }),
    setCustomColor: value =>
      state.dispatch({ type: actions.setCustomColor, value }),
    setCustomIcon: value =>
      state.dispatch({ type: actions.setCustomIcon, value }),
    toggleBold: () => state.dispatch({ type: actions.toggleBold }),
    toggleIsReadOnly: () => state.dispatch({ type: actions.toggleIsReadOnly }),
    resetToEdit: (value: ResetToEditProps) =>
      state.dispatch({ type: actions.resetToEdit, value }),
    resetToCreate: (value: ResetToCreateProps) =>
      state.dispatch({ type: actions.resetToCreate, value }),
    setPrivacy: (value: NodePrivacy) =>
      state.dispatch({ type: actions.setPrivacy, value }),
    addTag: (value: string) => state.dispatch({ type: actions.addTag, value }),
    removeTag: (value: string) =>
      state.dispatch({ type: actions.removeTag, value }),
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
      return { ...state, customIcon: +action.value };
    case actions.toggleBold:
      return { ...state, isBold: !state.isBold };
    case actions.toggleIsReadOnly:
      return { ...state, isReadOnly: !state.isReadOnly };
    case actions.setName:
      return { ...state, name: action.value };
    case actions.addTag:
      return { ...state, tags: [...state.tags, action.value] };
    case actions.removeTag:
      return {
        ...state,
        tags: state.tags.filter(_tag => _tag !== action.value),
      };
    case actions.resetToEdit:
      return resetToEdit(action.value);
    case actions.resetToCreate:
      return resetToCreate(action.value);
    case actions.setPrivacy:
      return {
        ...state,
        privacy: action.value,
      };
    default:
      throw new Error(action.type + ' action not supported');
  }
};

export {
  actionCreators as nodeMetaActionCreators,
  initialState as nodeMetaInitialState,
  reducer as nodeMetaReducer,
  TState as NodeMeta,
};
