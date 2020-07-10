import { createActionCreator as _, createReducer } from 'deox';
import { createActionPrefixer } from './helpers/shared';
import {
  NodeSearchResultEntity,
  SearchOptions,
  SearchScope,
  SearchTarget,
  SearchType,
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
      _ => (searchResults: NodeSearchResultEntity[]) => _(searchResults),
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
};

type SearchState = 'idle' | 'queued' | 'in-progress' | 'stand-by';

type State = {
  query: string;
  searchResults: NodeSearchResultEntity[];
  searchState: SearchState;
  searchScope: SearchScope;
  searchTarget: SearchTarget[];
  searchOptions: SearchOptions;
  searchType: SearchType;
  showFilters: boolean;
};

const initialState: State = {
  query: '',
  searchState: 'idle',
  searchScope: SearchScope.allDocuments,
  searchTarget: [SearchTarget.nodeContent, SearchTarget.nodeTitle],
  searchResults: [],
  searchOptions: {
    caseSensitive: false,
    fullWord: false,
  },
  searchType: SearchType.Simple,
  showFilters: false,
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
    })),
  ],
  ...[
    _(ac.setSearchIdle, state => ({
      ...state,
      searchState: 'idle',
    })),
    _(ac.setSearchInProgress, state => ({
      ...state,
      searchState: 'in-progress',
    })),
    _(ac.setSearchStandBy, state => ({
      ...state,
      searchState: 'stand-by',
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
]);

export { reducer as searchReducer, ac as searchActionCreators };
export { SearchState, State as SearchReducerState };
