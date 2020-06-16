import {
  applyMiddleware,
  createStore,
  compose,
  bindActionCreators,
} from 'redux';
import { createRootEpic } from '::root/store/epics/root';

import { reducer } from './reducer';
import { documentActionCreators } from './ducks/document';
import { dialogsActionCreators } from './ducks/dialogs';
import { nodeActionCreators } from './ducks/node';
import { createEpicMiddleware } from 'redux-observable';
import { editorActionCreators } from './ducks/editor';
import { documentsListActionCreators } from './ducks/documents-list';

type Store = ReturnType<typeof reducer>;

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

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
  },
  document: bindActionCreators(documentActionCreators, store.dispatch),
  dialogs: bindActionCreators(dialogsActionCreators, store.dispatch),
  node: bindActionCreators(nodeActionCreators, store.dispatch),
  editor: bindActionCreators(editorActionCreators, store.dispatch),
  documentsList: bindActionCreators(
    documentsListActionCreators,
    store.dispatch,
  ),
};

createRootEpic().then(epicMiddleware.run);

export { store, ac };
export { Store };
