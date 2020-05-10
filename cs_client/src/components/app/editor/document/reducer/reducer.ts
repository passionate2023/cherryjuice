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
    case documentActions.SET_FETCHED_IMAGE_IDS:
      return {
        ...state,
        nodes: {
          ...state.nodes,
          [action.value.nodeId]: {
            fetchedImageIDs: action.value.fetchedImageIDs,
          },
        },
      };
    case documentActions.SET_NODE_CONTENT_HAS_CHANGED:
      return {
        ...state,
        nodes: {
          ...state.nodes,
          [action.value.nodeId]: {
            ...state.nodes[action.value.nodeId],
            edited: {
              ...state.nodes[action.value.nodeId]?.edited,
              content: true,
            },
          },
        },
      };
    case documentActions.SET_NODE_META_HAS_CHANGED:
      return {
        ...state,
        nodes: {
          ...state.nodes,
          [action.value.nodeId]: {
            ...state.nodes[action.value.nodeId],
            edited: {
              ...state.nodes[action.value.nodeId]?.edited,
              meta: Array.from(
                new Set([
                  ...(state.nodes[action.value.nodeId]?.edited?.meta || []),
                  ...action.value.changedKeys,
                ]),
              ),
            },
          },
        },
      };
    default:
      throw new Error('action not supported');
  }
};

export { reducer as documentReducer };
export { TDocumentState };
