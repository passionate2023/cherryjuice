import {
  applyMiddleware,
  createStore,
  compose,
  bindActionCreators as b,
} from 'redux';
import { reducer } from './reducer';
import { documentActionCreators } from './ducks/document';
import { dialogsActionCreators } from './ducks/dialogs';
import { nodeActionCreators } from './ducks/node';
import { createEpicMiddleware } from 'redux-observable';
import { editorActionCreators } from './ducks/editor';
import { documentsListActionCreators } from './ducks/documents-list';
import { documentOperationsActionCreators } from './ducks/document-operation/document-operations';
import { rootActionCreators } from './ducks/root';
import { searchActionCreators } from './ducks/search';
import { cssVariablesActionCreators } from './ducks/css-variables';
import { setCssVariables } from './middleware/set-css-variables';
import { authActionCreators } from './ducks/auth';
import { hotkeysSettingsACs } from '::store/ducks/settings/hotkeys-settings/hotkeys-settings';
import { settingsActionCreators } from './ducks/settings';
import { documentCacheActionCreators } from '::store/ducks/document-cache/document-cache';
import { timelinesActionCreators } from '::store/ducks/timelines';
import { editorSettingsActionCreators } from '::store/ducks/settings/editor-settings/editor-settings';
import { bookmarksActionCreators } from '::store/ducks/bookmarks';
import { homeActionCreators } from '::store/ducks/home/home';

type Store = ReturnType<typeof reducer>;

const reduxDevtoolsExtensionCompose =
  process.env.NODE_ENV === 'development' &&
  // @ts-ignore
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

const composeEnhancers = reduxDevtoolsExtensionCompose
  ? reduxDevtoolsExtensionCompose({
      maxAge: 50,
    })
  : compose;

const epicMiddleware = createEpicMiddleware();
const middleware = applyMiddleware(epicMiddleware, setCssVariables);
const store = createStore(reducer, composeEnhancers(middleware));
const ac_ = {
  document: documentActionCreators,
  bookmarks: bookmarksActionCreators,
  dialogs: dialogsActionCreators,
  node: nodeActionCreators,
  editor: editorActionCreators,
  documentsList: documentsListActionCreators,
  documentOperations: documentOperationsActionCreators,
  root: rootActionCreators,
  search: searchActionCreators,
  cssVariables: cssVariablesActionCreators,
  auth: authActionCreators,
  hotkeySettings: hotkeysSettingsACs,
  settings: settingsActionCreators,
  documentCache: documentCacheActionCreators,
  timelines: timelinesActionCreators,
  editorSettings: editorSettingsActionCreators,
  home: homeActionCreators,
};
const dispatch = store.dispatch;
const ac = {
  document: b(documentActionCreators, dispatch),
  dialogs: b(dialogsActionCreators, dispatch),
  node: b(nodeActionCreators, dispatch),
  editor: b(editorActionCreators, dispatch),
  auth: b(authActionCreators, dispatch),
  timelines: b(timelinesActionCreators, dispatch),
  documentCache: b(documentCacheActionCreators, dispatch),
  documentsList: b(documentsListActionCreators, dispatch),
  documentOperations: b(documentOperationsActionCreators, dispatch),
  root: b(rootActionCreators, dispatch),
  hotkeySettings: b(hotkeysSettingsACs, dispatch),
  search: b(searchActionCreators, dispatch),
  cssVariables: b(cssVariablesActionCreators, dispatch),
  settings: b(settingsActionCreators, dispatch),
  editorSettings: b(editorSettingsActionCreators, dispatch),
  bookmarks: b(bookmarksActionCreators, dispatch),
  home: b(homeActionCreators, dispatch),
};

export { store, ac, ac_, epicMiddleware };
export { Store };
