import { TDocumentState } from '::app/editor/document/reducer/initial-state';
import { documentActions } from '::app/editor/document/reducer/action-creators';

const reducer = (
  state: TDocumentState,
  action: {
    type: documentActions;
    value: any;
  },
): TDocumentState => {
  let newState = state;
  switch (action.type) {
    case documentActions.setCacheUpdated:
      newState = {
        ...state,
        cacheTimeStamp: action.value.reset ? undefined : new Date().getTime(),
      };
      break;
    case documentActions.pastedImages:
      newState = {
        ...state,
        pastedImages: new Date().getTime(),
      };
      break;
    case documentActions.savingInProgress:
      newState = {
        ...state,
        savingInProgress: action.value,
      };
      break;
    default:
      throw new Error('action not supported');
  }

  return newState;
};

export { reducer as documentReducer };
export { TDocumentState };
