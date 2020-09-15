import { createActionCreator as _, createReducer } from 'deox';
import { createActionPrefixer } from './helpers/shared';
import { cloneObj } from '::helpers/editing/execK/helpers';
import { rootActionCreators as rac } from './root';
import { AsyncOperation } from '::store/ducks/document';
import { SelectNodeParams } from '::store/ducks/cache/document-cache/helpers/document/select-node';
import produce from 'immer';

const ap = createActionPrefixer('node');
const ac = {
  fetch: _(ap('fetch'), _ => (payload: SelectNodeParams) => _(payload)),
  fetchInProgress: _(ap('fetch-in-progress'), _ => (node_id: number) =>
    _(node_id),
  ),
  fetchFulfilled: _(ap('fetchFulfilled'), _ => (node_id: number) => _(node_id)),
  fetchFailed: _(ap('fetch-failed'), _ => (node_id: number) => _(node_id)),

  processLinks: _(ap('process-links')),

  select: _(ap('select'), _ => (payload: SelectNodeParams) => _(payload)),
  selectNext: _(ap('select-next'), _ => (payload: SelectNodeParams) =>
    _(payload),
  ),
  clearNext: _(ap('clear-next')),

  fetchAll: _(ap('fetch-all'), _ => (documentId: string) => _(documentId)),
  setFetchAllStatus: _(
    ap('set-fetch-all-status'),
    _ => (
      documentId: string,
      status: AsyncOperation,
      context?: FetchNodeContext,
      progress = 0,
    ) => _({ documentId, status, progress, context }),
  ),
};

type FetchNodeContext = 'images' | 'text';
type State = {
  asyncOperations: {
    fetch: {
      [node_id: number]: AsyncOperation;
    };
    fetchAll: {
      [documentId: string]: {
        status: AsyncOperation;
        progress: number;
        context: FetchNodeContext;
      };
    };
  };
  processLinks: number;
  next: SelectNodeParams;
};

const initialState: State = cloneObj<State>({
  asyncOperations: {
    fetch: {},
    fetchAll: {},
  },
  processLinks: 0,
  next: undefined,
});
const reducer = createReducer(initialState, _ => [
  ...[
    _(rac.resetState, () => ({
      ...cloneObj(initialState),
    })),
  ],
  _(ac.selectNext, (state, { payload }) => ({
    ...state,
    next: payload,
  })),
  _(ac.clearNext, state => ({
    ...state,
    next: undefined,
  })),
  _(ac.fetchInProgress, (state, { payload }) => ({
    ...state,
    asyncOperations: {
      ...state.asyncOperations,
      fetch: {
        ...state.asyncOperations.fetch,
        [payload]: 'in-progress',
      },
    },
  })),
  _(ac.fetchFulfilled, (state, { payload }) => ({
    ...state,
    asyncOperations: {
      ...state.asyncOperations,
      fetch: {
        ...state.asyncOperations.fetch,
        [payload]: 'idle',
      },
    },
  })),
  _(ac.fetchFailed, (state, { payload }) => ({
    ...state,
    asyncOperations: {
      ...state.asyncOperations,
      fetch: {
        ...state.asyncOperations.fetch,
        [payload]: 'idle',
      },
    },
  })),
  _(
    ac.setFetchAllStatus,
    (state, { payload: { documentId, status, progress, context } }) => {
      return produce(state, draft => {
        draft.asyncOperations.fetchAll[documentId] = {
          status,
          progress: progress.toFixed(2),
          context,
        };
        return draft;
      });
    },
  ),
]);

export { reducer as nodeReducer, ac as nodeActionCreators };
