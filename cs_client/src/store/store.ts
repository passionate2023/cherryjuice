import {
  applyMiddleware,
  createStore,
  compose,
  bindActionCreators,
} from 'redux';
import { reducer } from './reducer';
import { documentActionCreators } from './ducks/document';
import { dialogsActionCreators } from './ducks/dialogs';
import { nodeActionCreators } from './ducks/node';
import { createEpicMiddleware } from 'redux-observable';
import { editorActionCreators } from './ducks/editor';
import { documentsListActionCreators } from './ducks/documents-list';
import { documentOperationsActionCreators } from './ducks/document-operations';
import { rootActionCreators } from './ducks/root';
import { searchActionCreators } from './ducks/search';
import { cssVariablesActionCreators } from './ducks/css-variables';
import { setCssVariables } from './middleware/set-css-variables';
import { authActionCreators } from './ducks/auth';
import { cacheActionCreators } from './ducks/cache/cache';
import { settingsActionCreators } from './ducks/settings';
import { documentCacheActionCreators } from '::store/ducks/cache/document-cache';

type Store = ReturnType<typeof reducer>;

const reduxDevtoolsExtensionCompose =
  process.env.NODE_ENV === 'development' &&
  // @ts-ignore
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

const composeEnhancers = reduxDevtoolsExtensionCompose
  ? reduxDevtoolsExtensionCompose({
      maxAge: 10,
    })
  : compose;

const epicMiddleware = createEpicMiddleware();
const middleware = applyMiddleware(epicMiddleware, setCssVariables);
const store = createStore(reducer, composeEnhancers(middleware));

const ac = {
  __: {
    document: documentActionCreators,
    dialogs: dialogsActionCreators,
    node: nodeActionCreators,
    editor: editorActionCreators,
    documentsList: documentsListActionCreators,
    documentOperations: documentOperationsActionCreators,
    root: rootActionCreators,
    search: searchActionCreators,
    cssVariables: cssVariablesActionCreators,
    auth: authActionCreators,
    cache: cacheActionCreators,
    settings: settingsActionCreators,
    documentCache: documentCacheActionCreators,
  },
  document: bindActionCreators(documentActionCreators, store.dispatch),
  dialogs: bindActionCreators(dialogsActionCreators, store.dispatch),
  node: bindActionCreators(nodeActionCreators, store.dispatch),
  editor: bindActionCreators(editorActionCreators, store.dispatch),
  auth: bindActionCreators(authActionCreators, store.dispatch),
  documentCache: bindActionCreators(
    documentCacheActionCreators,
    store.dispatch,
  ),
  documentsList: bindActionCreators(
    documentsListActionCreators,
    store.dispatch,
  ),
  documentOperations: bindActionCreators(
    documentOperationsActionCreators,
    store.dispatch,
  ),
  root: bindActionCreators(rootActionCreators, store.dispatch),
  cache: bindActionCreators(cacheActionCreators, store.dispatch),
  search: bindActionCreators(searchActionCreators, store.dispatch),
  cssVariables: bindActionCreators(cssVariablesActionCreators, store.dispatch),
  settings: bindActionCreators(settingsActionCreators, store.dispatch),
};

export { store, ac, epicMiddleware };
export { Store };
