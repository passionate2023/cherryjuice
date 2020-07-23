import {
  calculateCreatedDocumentState,
  calculateEditedDocumentState,
} from './helpers/calculate-state';
import { DocumentOwner, OwnershipLevel } from '::types/graphql/generated';
import { QDocumentMeta } from '::graphql/queries/query-document';

type TState = {
  name: string;
  owner: DocumentOwner;
};
const initialState: TState = {
  name: 'new document',
  owner: {
    public: false,
    ownershipLevel: OwnershipLevel.OWNER,
    userId: undefined,
  },
};

enum actions {
  setName,
  resetToEdit,
  resetToCreate,
  toggleIsPublic,
}

export type ResetToCreateProps = { userId: string };
export type ResetToEditProps = { document: QDocumentMeta };
const actionCreators = (() => {
  const state = {
    dispatch: undefined,
  };
  return {
    __setDispatch: dispatch => (state.dispatch = dispatch),
    setName: value => state.dispatch({ type: actions.setName, value }),
    resetToEdit: (value: ResetToEditProps) =>
      state.dispatch({ type: actions.resetToEdit, value }),
    resetToCreate: (value: ResetToCreateProps) =>
      state.dispatch({ type: actions.resetToCreate, value }),
    toggleIsPublic: () => state.dispatch({ type: actions.toggleIsPublic }),
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
    case actions.setName:
      return { ...state, name: action.value };
    case actions.resetToEdit:
      return calculateEditedDocumentState(action.value);
    case actions.resetToCreate:
      return calculateCreatedDocumentState(action.value);
    case actions.toggleIsPublic:
      return {
        ...state,
        owner: {
          ...state.owner,
          public: !state.owner.public,
        },
      };
    default:
      throw new Error(action.type + ' action not supported');
  }
};

export {
  actionCreators as documentMetaActionCreators,
  initialState as documentMetaInitialState,
  reducer as documentMetaReducer,
  TState as TDocumentMetaState,
};
