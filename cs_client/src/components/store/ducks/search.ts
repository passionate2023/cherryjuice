import { createActionCreator as _, createReducer } from 'deox';
import { createActionPrefixer } from './helpers/shared';
import { NodeSearchResultEntity } from '::types/graphql/generated';

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
  },
  ...{
    setSearchType: _(ap('set-search-type'), _ => (scope: SearchType) =>
      _(scope),
    ),
  },
};

type SearchState = 'idle' | 'queued' | 'in-progress' | 'stand-by';
type SearchScope =
  | 'current-node'
  | 'child-nodes'
  | 'current-document'
  | 'all-documents';
type SearchType = 'node-content' | 'node-title';

type State = {
  query: string;
  searchState: SearchState;
  searchScope: SearchScope;
  searchType: SearchType[];
  searchResults: NodeSearchResultEntity[];
};

const initialState: State = {
  query: '',
  searchState: 'idle',
  searchScope: 'current-document',
  searchType: ['node-content'],
  searchResults: [],
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
    _(ac.setSearchScope, (state, { payload }) => ({
      ...state,
      searchScope: payload,
    })),
  ],
  ...[
    _(ac.setSearchType, (state, { payload }) => ({
      ...state,
      searchType: state.searchType.includes(payload)
        ? state.searchType.filter(type => type !== payload)
        : [...state.searchType, payload],
    })),
  ],
]);

export { reducer as searchReducer, ac as searchActionCreators };
export { SearchState, SearchScope, SearchType };
