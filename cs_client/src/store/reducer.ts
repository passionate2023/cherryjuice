import { combineReducers, Reducer } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { documentReducer } from './ducks/document';
import { dialogsReducer } from './ducks/dialogs';
import { nodeReducer } from './ducks/node';
import { editorReducer } from './ducks/editor';
import { documentsListReducer } from './ducks/documents-list';
import { documentOperationsReducer } from './ducks/document-operation/document-operations';
import { rootReducer, RootReducerState } from './ducks/root';
import { searchReducer, SearchReducerState } from './ducks/search';
import { cssVariablesReducer } from './ducks/css-variables';
import { authReducer } from './ducks/auth';
import { cacheReducer } from './ducks/cache/cache';
import { settingsReducer } from './ducks/settings';
import { documentCacheReducer } from '::store/ducks/cache/document-cache';
import { animationReducer } from '::store/ducks/animations';
import { timelinesReducer } from '::store/ducks/timelines';
import { editorSettingsReducer } from '::store/ducks/settings/editor-settings';

const persistedReducers = {
  documentCache: persistReducer(
    {
      key: 'documentCache',
      storage,
      blacklist: [],
    },
    documentCacheReducer,
  ),
  auth: persistReducer(
    {
      key: 'auth',
      storage,
      blacklist: ['ongoingOperation', 'alert'],
    },
    authReducer,
  ),
  editorSettings: persistReducer(
    {
      key: 'editorSettings',
      storage,
    },
    editorSettingsReducer,
  ),
  cache: persistReducer(
    {
      key: 'cache',
      storage,
    },
    cacheReducer,
  ),
  editor: persistReducer(
    {
      key: 'editor',
      storage,
      blacklist: [
        'anchorId',
        'selectedLink',
        'selection',
        'selectedCodebox',
        'selectedTable',
      ],
    },
    editorReducer,
  ),
  settings: persistReducer(
    {
      key: 'settings',
      storage,
      whitelist: ['selectedScreen'],
    },
    settingsReducer,
  ),
  root: persistReducer(
    {
      key: 'root',
      storage,
      blacklist: ['online'],
    },
    rootReducer,
  ) as Reducer<RootReducerState>,
  search: persistReducer(
    {
      key: 'search',
      storage,
      blacklist: ['query', 'searchResults', 'searchState'],
    },
    searchReducer,
  ) as Reducer<SearchReducerState>,
  cssVariables: persistReducer(
    {
      key: 'cssVariables',
      storage,
      blacklist: [],
    },
    cssVariablesReducer,
  ),
};

const nonPersistedReducers = {
  document: documentReducer,
  animation: animationReducer,
  dialogs: dialogsReducer,
  node: nodeReducer,
  documentsList: documentsListReducer,
  documentOperations: documentOperationsReducer,
  timelines: timelinesReducer,
};
const reducer = combineReducers({
  ...persistedReducers,
  ...nonPersistedReducers,
});

export { reducer };
