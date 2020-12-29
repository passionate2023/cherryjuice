import { createActionCreator as _, createReducer } from 'deox';
import { createActionPrefixer } from './helpers/shared';
import {
  SearchSortOptions,
  SortDirection,
  SortNodesBy,
} from '@cherryjuice/graphql-types';
import { rootActionCreators as rac } from '::store/ducks/root';
import { cloneObj } from '@cherryjuice/shared-helpers';

const ap = createActionPrefixer('bookmarks');

const ac = {
  select: _(ap('select'), _ => (node_id: number) => _(node_id)),
  selectAll: _(ap('select-all'), _ => (node_ids: number[]) => _(node_ids)),
  enableDeletionMode: _(ap('enable-deletion-mode')),
  disableDeletionMode: _(ap('disable-deletion-mode')),
  setQuery: _(ap('set-query'), _ => (query: string) => _(query)),
  clearQuery: _(ap('clear-query')),
  toggleSortOptions: _(ap('toggle-sort-options')),
  setSortBy: _(ap('set-sort-by'), _ => (options: SortNodesBy) => _(options)),
  toggleSortDirection: _(ap('toggle-sort-direction')),
};

type State = {
  query?: string;
  selectedIDs: number[];
  deletionMode: boolean;
  sortOptions: SearchSortOptions;
  showSortOptions: boolean;
};

const initialState: State = {
  selectedIDs: [],
  deletionMode: false,
  query: '',
  sortOptions: {
    sortBy: SortNodesBy.NodeName,
    sortDirection: SortDirection.Ascending,
  },
  showSortOptions: false,
};

const reducer = createReducer(initialState, _ => [
  _(rac.resetState, () => ({
    ...cloneObj(initialState),
  })),
  _(ac.select, (state, { payload }) => ({
    ...state,
    selectedIDs: [payload],
  })),
  _(ac.selectAll, (state, { payload }) => ({
    ...state,
    selectedIDs: payload,
  })),
  _(ac.enableDeletionMode, state => ({
    ...state,
    deletionMode: true,
    selectedIDs: [],
  })),
  _(ac.disableDeletionMode, state => ({
    ...state,
    deletionMode: false,
    selectedIDs: [],
  })),
  ...[
    _(ac.setQuery, (state, { payload }) => ({
      ...state,
      query: payload,
    })),
    _(ac.clearQuery, state => ({
      ...state,
      query: '',
    })),
  ],
  ...[
    _(ac.setSortBy, (state, { payload }) => ({
      ...state,
      sortOptions: {
        ...state.sortOptions,
        sortBy: payload,
      },
    })),
    _(ac.toggleSortDirection, state => ({
      ...state,
      sortOptions: {
        ...state.sortOptions,
        sortDirection:
          state.sortOptions.sortDirection === SortDirection.Descending
            ? SortDirection.Ascending
            : SortDirection.Descending,
      },
    })),
    _(ac.toggleSortOptions, state => ({
      ...state,
      showSortOptions: !state.showSortOptions,
    })),
  ],
]);

export { reducer as bookmarksReducer, ac as bookmarksActionCreators };
