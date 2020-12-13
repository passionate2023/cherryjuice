import { combineReducers, Reducer } from 'redux';
import { persistReducer } from 'redux-persist';
import localForage from 'localforage';
import localStorage from 'redux-persist/lib/storage';
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
import { settingsReducer } from './ducks/settings';
import { documentCacheReducer } from '::store/ducks/document-cache/document-cache';
import { animationReducer } from '::store/ducks/animations';
import { timelinesReducer } from '::store/ducks/timelines';
import { editorSettingsReducer } from '::store/ducks/settings/editor-settings/editor-settings';
import { bookmarksReducer } from '::store/ducks/bookmarks';
import { hotkeysSettingsReducer } from '::store/ducks/settings/hotkeys-settings/hotkeys-settings';

const localStorageReducerConfig = {
  storage: localStorage,
};
const localForageReducerConfig = {
  storage: localForage,
  timeout: 0,
};
const localForageReducers = {
  documentCache: persistReducer(
    {
      ...localForageReducerConfig,
      key: 'documentCache',
      blacklist: [],
    },
    documentCacheReducer,
  ),
};
const localStorageReducers = {
  auth: persistReducer(
    {
      ...localStorageReducerConfig,
      key: 'auth',
      blacklist: ['ongoingOperation', 'alert'],
    },
    authReducer,
  ),
  editorSettings: persistReducer(
    {
      ...localStorageReducerConfig,
      key: 'editorSettings',
    },
    editorSettingsReducer,
  ),
  hotkeySettings: persistReducer(
    {
      ...localStorageReducerConfig,
      key: 'hotkeySettings',
    },
    hotkeysSettingsReducer,
  ),
  editor: persistReducer(
    {
      ...localStorageReducerConfig,
      key: 'editor',
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
      ...localStorageReducerConfig,
      key: 'settings',
      whitelist: ['selectedScreen'],
    },
    settingsReducer,
  ),
  root: persistReducer(
    {
      ...localStorageReducerConfig,
      key: 'root',
      blacklist: ['online'],
    },
    rootReducer,
  ) as Reducer<RootReducerState>,
  search: persistReducer(
    {
      ...localStorageReducerConfig,
      key: 'search',
      blacklist: ['query', 'searchResults', 'searchState'],
    },
    searchReducer,
  ) as Reducer<SearchReducerState>,
  cssVariables: persistReducer(
    {
      ...localStorageReducerConfig,
      key: 'cssVariables',
      blacklist: [],
    },
    cssVariablesReducer,
  ),
};

const nonPersistedReducers = {
  bookmarks: bookmarksReducer,
  document: documentReducer,
  animation: animationReducer,
  dialogs: dialogsReducer,
  node: nodeReducer,
  documentsList: documentsListReducer,
  documentOperations: documentOperationsReducer,
  timelines: timelinesReducer,
};
const reducer = combineReducers({
  ...localForageReducers,
  ...localStorageReducers,
  ...nonPersistedReducers,
});

export { reducer };
