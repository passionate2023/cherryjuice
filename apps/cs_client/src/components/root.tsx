import * as React from 'react';
import { Suspense } from 'react';
// @ts-ignore
import modTheme from '@cherryjuice/shared-styles/build/themes/themes.scss';
import '::assets/styles/global-scope/material-ui.scss';
import '::assets/styles/global-scope/google-picker.scss';
import '@cherryjuice/shared-styles/build/global/body.scss';
import '@cherryjuice/shared-styles/build/global/base.scss';
import '@cherryjuice/shared-styles/build/global/css-variables.scss';
import { useApolloClient } from '::graphql/client/hooks/apollo-client';
import { Route, Switch } from 'react-router';
import { connect, ConnectedProps, Provider } from 'react-redux';
import { Void } from '::root/components/shared-components/react/void';
import { App } from '::root/components/app/app';
import { useOnWindowResize } from '::hooks/use-on-window-resize';
import { ac, store, Store } from '::store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { useLoadEpics } from './hooks/load-epics';
import { useRegisterHotKeys } from '::helpers/hotkeys/hooks/register-hot-keys';
import { useConsumeToken } from '::root/hooks/consume-token';
import { Auth } from '::root/components/auth/auth';
import { getHotkeys } from '::store/selectors/cache/settings/hotkeys';
import { useTrackDocumentChanges } from '::root/hooks/track-document-changes';
import { enablePatches } from 'immer';
import '::helpers/attach-test-callbacks';
import {
  getCurrentDocument,
  getDocumentsList,
} from '::store/selectors/cache/document/document';
import { documentHasUnsavedChanges } from '::root/components/app/components/menus/dialogs/documents-list/components/documents-list/components/document/document';
import { useRouterEffect } from '::root/components/app/components/editor/hooks/router-effect/router-effect';
import { Router } from 'react-router-dom';
import { router } from '::root/router/router';
import { useTasks } from '::root/hooks/tasks';
import { CssVariables } from '::store/ducks/css-variables';
import 'hint.css';

enablePatches();
const ApolloProvider = React.lazy(() =>
  import('@apollo/react-common').then(({ ApolloProvider }) => ({
    default: ApolloProvider,
  })),
);

const updateBreakpointState = ({ breakpoint, callback }) => {
  let previousState = undefined;
  return () => {
    const newState = window.innerWidth <= breakpoint;
    if (previousState != newState) {
      previousState = newState;
      callback(newState);
    }
  };
};

const mapState = (state: Store) => ({
  token: state.auth.token,
  online: state.root.online,
  userId: state.auth.user?.id,
  hotKeys: getHotkeys(state),
  document: getCurrentDocument(state),
  userHasUnsavedChanges: getDocumentsList(state).some(
    documentHasUnsavedChanges,
  ),
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};

const Root: React.FC<Props & PropsFromRedux> = ({
  token,
  userId,
  hotKeys,
  document,
  userHasUnsavedChanges,
  online,
}) => {
  const client = useApolloClient(token, userId);
  useOnWindowResize([
    (w, h) => ac.cssVariables.set(CssVariables.vh, h),
    w => ac.cssVariables.set(CssVariables.vw, w),
    updateBreakpointState({
      breakpoint: 850,
      callback: ac.root.setIsOnMd,
    }),
    updateBreakpointState({
      breakpoint: 425,
      callback: ac.root.setIsOnMb,
    }),
  ]);
  useRegisterHotKeys(hotKeys);
  useTrackDocumentChanges({
    userHasUnsavedChanges,
    documentName: document?.name,
    userId,
    online,
  });
  useConsumeToken({ userId });
  useRouterEffect();
  useTasks();

  return (
    <Suspense fallback={<Void />}>
      {client && (
        <ApolloProvider client={client}>
          <Switch>
            <Route path={'/auth'} component={Auth} />
            <Route path={'(/|/document/*)'} component={App} />
          </Switch>
        </ApolloProvider>
      )}
    </Suspense>
  );
};

const ConnectedRoot = connector(Root);

const RootWithRedux: React.FC = props => {
  const { loadedEpics } = useLoadEpics();
  return (
    <Router history={router.get.history}>
      {loadedEpics && (
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistStore(store)}>
            <div className={modTheme.lightTheme}>
              <ConnectedRoot {...props} />
            </div>
          </PersistGate>
        </Provider>
      )}
    </Router>
  );
};
export default RootWithRedux;
