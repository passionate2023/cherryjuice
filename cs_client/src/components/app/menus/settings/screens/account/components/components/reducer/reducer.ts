import { QDocumentsListItem } from '::graphql/queries/documents-list';

type State = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
};
const initialState: State = {
  firstName: '',
  lastName: '',
  email: '',
  username: '',
};

enum actions {
  setFirstName,
  setLastName,
  reset,
}

export type ResetToCreateProps = {};
export type ResetToEditProps = { document: QDocumentsListItem };
const actionCreators = (() => {
  const state = {
    dispatch: undefined,
  };
  return {
    __setDispatch: dispatch => (state.dispatch = dispatch),
    setFirstName: (value: string) =>
      state.dispatch({ type: actions.setFirstName, value }),
    setLastName: (value: string) =>
      state.dispatch({ type: actions.setLastName, value }),
  };
})();

const reducer = (
  state: State,
  action: {
    type: actions;
    value: any;
  },
): State => {
  switch (action.type) {
    case actions.setFirstName:
      return { ...state, firstName: action.value };
    case actions.setLastName:
      return { ...state, lastName: action.value };
    default:
      throw new Error(action.type + ' action not supported');
  }
};

export {
  actionCreators as userSettingsActionCreators,
  initialState as userSettingsInitialState,
  reducer as userSettingsReducer,
  State as TUserSettingsMetaState,
};
