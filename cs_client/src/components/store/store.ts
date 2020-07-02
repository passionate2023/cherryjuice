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

type Store = ReturnType<typeof reducer>;

const composeEnhancers =
  // @ts-ignore
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ maxAge: 10 }) || compose;

const epicMiddleware = createEpicMiddleware();
const middleware = applyMiddleware(epicMiddleware);
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
  },
  document: bindActionCreators(documentActionCreators, store.dispatch),
  dialogs: bindActionCreators(dialogsActionCreators, store.dispatch),
  node: bindActionCreators(nodeActionCreators, store.dispatch),
  editor: bindActionCreators(editorActionCreators, store.dispatch),
  documentsList: bindActionCreators(
    documentsListActionCreators,
    store.dispatch,
  ),
  documentOperations: bindActionCreators(
    documentOperationsActionCreators,
    store.dispatch,
  ),
  root: bindActionCreators(rootActionCreators, store.dispatch),
};

export { store, ac, epicMiddleware };
export { Store };
