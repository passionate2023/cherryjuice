import {
  calculateCreatedDocumentState,
  calculateEditedDocumentState,
} from './helpers/calculate-state';
import {
  AccessLevel,
  DocumentGuestOt,
  Privacy,
} from '::types/graphql/generated';
import { QDocumentsListItem } from '::graphql/queries/documents-list';

type TState = {
  name: string;
  privacy: Privacy;
  guests: DocumentGuestOt[];
};
const initialState: TState = {
  name: 'new document',
  privacy: Privacy.PRIVATE,
  guests: [],
};

enum actions {
  setName,
  resetToEdit,
  resetToCreate,
  setPrivacy,
  toggleUserAccessLevel,
  addGuest,
  removeGuest,
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
    toggleUserAccessLevel: (userId: string) =>
      state.dispatch({ type: actions.toggleUserAccessLevel, value: userId }),
    addGuest: (value: DocumentGuestOt) =>
      state.dispatch({ type: actions.addGuest, value }),
    removeGuest: (userId: string) =>
      state.dispatch({ type: actions.removeGuest, value: userId }),
    setPrivacy: (value: Privacy) =>
      state.dispatch({ type: actions.setPrivacy, value }),
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
    case actions.setPrivacy:
      return {
        ...state,
        privacy: action.value,
      };
    case actions.addGuest:
      return {
        ...state,
        guests: state.guests.some(guest => guest.userId === action.value.userId)
          ? state.guests
          : [...state.guests, action.value],
      };
    case actions.toggleUserAccessLevel:
      return {
        ...state,
        guests: state.guests.map(guest =>
          guest.userId === action.value
            ? {
                ...guest,
                accessLevel:
                  guest.accessLevel === AccessLevel.WRITER
                    ? AccessLevel.READER
                    : AccessLevel.WRITER,
              }
            : guest,
        ),
      };
    case actions.removeGuest:
      return {
        ...state,
        guests: state.guests.filter(guest => guest.userId !== action.value),
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
