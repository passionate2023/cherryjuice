import {
  documentInitialState,
  TDocumentState,
} from '::app/editor/document/reducer/initial-state';
import {
  documentActions,
  localChanges,
} from '::app/editor/document/reducer/action-creators';

const reducer = (
  state: TDocumentState,
  action: {
    type: documentActions;
    value: any;
  },
): TDocumentState => {
  let newState = state;
  switch (action.type) {
    case documentActions.clearAllLocalChanges:
      newState = documentInitialState;
      break;
    case documentActions.SET_FETCHED_IMAGE_IDS:
      newState = {
        ...state,
        nodes: {
          ...state.nodes,
          [action.value.nodeId]: {
            fetchedImageIDs: action.value.fetchedImageIDs,
          },
        },
      };
      break;
    case documentActions.SET_NODE_CONTENT_HAS_CHANGED:
      newState = {
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
      break;
    case documentActions.SET_NODE_META_HAS_CHANGED:
      newState = {
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
      break;
    case documentActions.CREATE_NEW_NODE:
      newState = {
        ...state,
        nodes: {
          ...state.nodes,
          [action.value.nodeId]: {
            new: true,
          },
        },
      };
      break;
    case documentActions.CLEAR_LOCAL_CHANGES:
      newState = {
        ...state,
        nodes: {
          ...[state.nodes].map(nodes => {
            if (action.value.level === localChanges.META)
              delete nodes[action.value.nodeId]?.edited?.meta;
            else if (action.value.level === localChanges.CONTENT)
              delete nodes[action.value.nodeId]?.edited?.content;
            else if (action.value.level === localChanges.IS_NEW)
              delete nodes[action.value.nodeId]?.new;
            else if (action.value.level === localChanges.DELETED)
              delete nodes[action.value.nodeId]?.deleted;
            return nodes;
          })[0],
        },
      };
      break;
    case documentActions.DELETE_NODE:
      newState = {
        ...state,
        nodes: {
          ...state.nodes,
          [action.value.nodeId]: {
            deleted: true,
          },
        },
      };
      break;
    default:
      throw new Error('action not supported');
  }

  return newState;
};

export { reducer as documentReducer };
export { TDocumentState };
