import { createActionCreator as _, createReducer } from 'deox';
import { createActionPrefixer } from './helpers/shared';
import {
  NodeSearchResults,
  SearchOptions,
  SearchScope,
  SearchSortOptions,
  SearchTarget,
  SearchType,
  SortDirection,
  SortNodesBy,
  TimeFilter,
  TimeRange,
} from '::types/graphql/generated';

const ap = createActionPrefixer('search');

const ac = {
  ...{
    setQuery: _(ap('set-query'), _ => (query: string) => _(query)),
    clearQuery: _(ap('clear-query')),
  },
  ...{
    setSearchIdle: _(ap('set-search-idle')),
    setSearchStandBy: _(ap('set-search-stand-by')),
    setSearchQueued: _(ap('set-search-queued')),
    setSearchInProgress: _(ap('set-search-in-progress')),
    setSearchFulfilled: _(
      ap('set-search-fulfilled'),
      _ => (result: NodeSearchResults) => _(result),
    ),
  },
  ...{
    setSearchScope: _(ap('set-search-scope'), _ => (scope: SearchScope) =>
      _(scope),
    ),
    setSearchTarget: _(ap('set-search-target'), _ => (scope: SearchTarget) =>
      _(scope),
    ),
    setSearchOptions: _(
      ap('set-search-options'),
      _ => (options: SearchOptions) => _(options),
    ),
    setSearchType: _(ap('set-search-type'), _ => (args: SearchType) => _(args)),
  },
  ...{
    toggleFilters: _(ap('toggle-filters')),
  },
  ...{
    setUpdatedAtTimeFilter: _(
      ap('set-updated-at-time-filter'),
      _ => (filter: TimeFilter) => _(filter),
    ),
    setCreatedAtTimeFilter: _(
      ap('set-created-at-time-filter'),
      _ => (filter: TimeFilter) => _(filter),
    ),
  },
  ...{
    setSortBy: _(ap('set-sort-by'), _ => (options: SortNodesBy) => _(options)),
    toggleSortDirection: _(ap('toggle-sort-direction')),
  },
};

type SearchState = 'idle' | 'queued' | 'in-progress' | 'stand-by';

type State = {
  query: string;
  searchResults: NodeSearchResults;
  searchState: SearchState;
  searchScope: SearchScope;
  searchTarget: SearchTarget[];
  searchOptions: SearchOptions;
  searchType: SearchType;
  showFilters: boolean;
  createdAtTimeFilter: TimeFilter;
  updatedAtTimeFilter: TimeFilter;
  sortOptions: SearchSortOptions;
};

const EmptyTimeFilter = {
  rangeName: TimeRange.AnyTime,
  rangeStart: 0,
  rangeEnd: 0,
};
const EmptySearchResults = { results: [], meta: { elapsedTimeMs: -1 } };
const initialState: State = {
  query: '',
  searchState: 'idle',
  searchScope: SearchScope.allDocuments,
  searchTarget: [SearchTarget.nodeContent, SearchTarget.nodeTitle],
  searchResults: EmptySearchResults,
  searchOptions: {
    caseSensitive: false,
    fullWord: false,
  },
  searchType: SearchType.Simple,
  showFilters: false,
  createdAtTimeFilter: EmptyTimeFilter,
  updatedAtTimeFilter: EmptyTimeFilter,
  sortOptions: {
    sortBy: SortNodesBy.UpdatedAt,
    sortDirection: SortDirection.Descending,
  },
};

const reducer = createReducer(initialState, _ => [
  ...[
    _(ac.setQuery, (state, { payload }) => ({
      ...state,
      query: payload,
    })),
    _(ac.clearQuery, state => ({
      ...state,
      query: '',
      searchResults: EmptySearchResults
    })),
  ],
  ...[
    _(ac.setSearchIdle, state => ({
      ...state,
      searchState: 'idle',
      searchResults: EmptySearchResults
    })),
    _(ac.setSearchStandBy, state => ({
      ...state,
      searchState: 'stand-by',
      searchResults: EmptySearchResults
    })),
    _(ac.setSearchInProgress, state => ({
      ...state,
      searchState: 'in-progress',
    })),
    _(ac.setSearchFulfilled, (state, { payload }) => ({
      ...state,
      searchState: 'stand-by',
      searchResults: payload,
    })),
  ],
  ...[
    _(ac.setSearchOptions, (state, { payload }) => ({
      ...state,
      searchOptions: payload,
    })),
    _(ac.setSearchType, (state, { payload }) => ({
      ...state,
      searchType: payload,
    })),
    _(ac.setSearchScope, (state, { payload }) => ({
      ...state,
      searchScope: payload,
    })),
  ],
  ...[
    _(ac.setSearchTarget, (state, { payload }) => ({
      ...state,
      searchTarget: state.searchTarget.includes(payload)
        ? state.searchTarget.filter(type => type !== payload)
        : [...state.searchTarget, payload],
    })),
  ],
  ...[
    _(ac.toggleFilters, state => ({
      ...state,
      showFilters: !state.showFilters,
    })),
  ],
  ...[
    _(ac.setCreatedAtTimeFilter, (state, { payload }) => ({
      ...state,
      createdAtTimeFilter: payload,
    })),
    _(ac.setUpdatedAtTimeFilter, (state, { payload }) => ({
      ...state,
      updatedAtTimeFilter: payload,
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
  ],
]);

export {
  EmptyTimeFilter,
  reducer as searchReducer,
  ac as searchActionCreators,
};
export { SearchState, State as SearchReducerState };
