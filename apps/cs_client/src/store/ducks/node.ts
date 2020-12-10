import { createActionCreator as _, createReducer } from 'deox';
import { createActionPrefixer } from './helpers/shared';
import { cloneObj } from '@cherryjuice/shared-helpers';
import { rootActionCreators as rac } from './root';
import { AsyncOperation } from '::store/ducks/document';
import {
  CloseNodeParams,
  SelectNodeParams,
} from '::store/ducks/document-cache/helpers/document/select-node';
import { OnDropParam } from '::root/components/app/components/editor/document/components/tree/components/node/_/droppable';
import { DropMeta } from '::store/ducks/document-cache/helpers/node/drop/drop';

const ap = createActionPrefixer('node');

const ac = {
  fetch: _(ap('fetch'), _ => (payload: SelectNodeParams) => _(payload)),
  fetchInProgress: _(ap('fetch-in-progress'), _ => (node_id: number) =>
    _(node_id),
  ),
  fetchFulfilled: _(ap('fetchFulfilled'), _ => (node_id: number) => _(node_id)),
  fetchFailed: _(ap('fetch-failed'), _ => (node_id: number) => _(node_id)),
  select: _(ap('select'), _ => (payload: SelectNodeParams) => _(payload)),
  close: _(ap('close'), _ => (payload: CloseNodeParams) => _(payload)),
  drop: _(ap('drop'), _ => (payload: OnDropParam<DropMeta>) => _(payload)),
  selectNext: _(ap('select-next'), _ => (payload: SelectNodeParams) =>
    _(payload),
  ),
  clearNext: _(ap('clear-next')),

  fetchAll: _(ap('fetch-all'), _ => (documentId: string) => _(documentId)),
};

type State = {
  asyncOperations: {
    fetch: {
      [node_id: number]: AsyncOperation;
    };
  };
  next: SelectNodeParams;
};

const initialState: State = cloneObj<State>({
  asyncOperations: {
    fetch: {},
  },
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
]);

export { reducer as nodeReducer, ac as nodeActionCreators };
