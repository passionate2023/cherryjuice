import { TDocumentState } from '::app/editor/document/reducer/initial-state';
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
    case documentActions.CREATE_NEW_NODE:
      return {
        ...state,
        nodes: {
          ...state.nodes,
          [action.value.nodeId]: {
            new: true,
          },
        },
      };
    case documentActions.CLEAR_LOCAL_CHANGES:
      return {
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
    case documentActions.DELETE_NODE:
      return {
        ...state,
        nodes: {
          ...state.nodes,
          [action.value.nodeId]: {
            deleted: true,
          },
        },
      };
    default:
      throw new Error('action not supported');
  }
};

export { reducer as documentReducer };
export { TDocumentState };
