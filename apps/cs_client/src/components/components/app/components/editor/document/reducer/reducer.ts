import { TDocumentState } from '::root/components/app/components/editor/document/reducer/initial-state';
import { documentActions } from '::root/components/app/components/editor/document/reducer/action-creators';

const reducer = (
  state: TDocumentState,
  action: {
    type: documentActions;
    value: any;
  },
): TDocumentState => {
  let newState = state;
  switch (action.type) {
    case documentActions.pastedImages:
      newState = {
        ...state,
        pastedImages: new Date().getTime(),
      };
      break;

    default:
      throw new Error('action not supported');
  }

  return newState;
};

export { reducer as documentReducer };
export { TDocumentState };
