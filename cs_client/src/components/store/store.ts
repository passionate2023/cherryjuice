import {
  applyMiddleware,
  createStore,
  compose,
  bindActionCreators,
} from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { rootEpic } from '::root/store/epics';
const epicMiddleware = createEpicMiddleware();
const middleware = applyMiddleware(epicMiddleware);
import { reducer } from './reducer';
import { documentActionCreators } from './ducks/document';
import { dialogsActionCreators } from './ducks/dialogs';
import { nodeActionCreators } from './ducks/node';

type Store = ReturnType<typeof reducer>;

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, composeEnhancers(middleware));
// @ts-ignore
epicMiddleware.run(rootEpic);
const ac = {
  document: bindActionCreators(documentActionCreators, store.dispatch),
  dialogs: bindActionCreators(dialogsActionCreators, store.dispatch),
  node: bindActionCreators(nodeActionCreators, store.dispatch),
};
export { store, ac };
export { Store };
