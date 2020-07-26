import {
  calculateCreatedDocumentState,
  calculateEditedDocumentState,
} from './helpers/calculate-state';
import { Privacy } from '::types/graphql/generated';
import { QDocumentsListItem } from '::graphql/queries/documents-list';

type TState = {
  name: string;
  privacy: Privacy;
};
const initialState: TState = {
  name: 'new document',
  privacy: Privacy.PRIVATE,
};

enum actions {
  setName,
  resetToEdit,
  resetToCreate,
  toggleIsPublic,
}

export type ResetToCreateProps = {};
export type ResetToEditProps = { document: QDocumentsListItem };
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
      return calculateCreatedDocumentState();
    case actions.toggleIsPublic:
      return {
        ...state,
        privacy:
          state.privacy === Privacy.PRIVATE ? Privacy.PUBLIC : Privacy.PRIVATE,
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
