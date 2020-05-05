import { TDocumentState } from '::app/editor/document/reducer/initial-state';
import { documentActions } from '::app/editor/document/reducer/action-creators';

const reducer = (
  state: TDocumentState,
  action: {
    type: documentActions;
    value: any;
  },
): TDocumentState => {
  switch (action.type) {
    case documentActions.SET_IMAGE_IDS:
      return {
        ...state,
        nodes: {
          [action.value.node_id]: { imageIDs: action.value.imageIDs },
        },
      };
    default:
      throw new Error('action not supported');
  }
};

export { reducer as documentReducer };
