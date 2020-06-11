import { cssVariables } from '::assets/styles/css-variables/set-css-variables';
import * as React from 'react';
import { useEffect, useReducer, Suspense } from 'react';
import {
  appActionCreators,
  appInitialState,
  appReducer,
  TState,
} from './reducer';
import { Void } from '::shared-components/suspense-fallback/void';
import { formattingBarUnmountAnimationDelay } from './editor/tool-bar/groups/formatting-buttons';
import { AuthUser } from '::types/graphql/generated';
import { useOnWindowResize } from '::hooks/use-on-window-resize';
import { appModule } from '::sass-modules/index';
import { useLazyQuery } from '@apollo/react-hooks';
import { QUERY_USER } from '::graphql/queries';
import { rootActionCreators } from '::root/root.reducer';
import { AppContext } from './context';
import { useDocumentEditedIndicator } from '::app/hooks/document-edited-indicator';

const Menus = React.lazy(() => import('::app/menus'));
const Editor = React.lazy(() => import('::app/editor'));

type Props = { session: AuthUser };

const useSaveStateToLocalStorage = state => {
  useEffect(() => {
    Object.entries(state).forEach(([key, value]) => {
      const toBeWritten =
        typeof value === 'object' ? JSON.stringify(value) : (value as string);
      if (value !== undefined) localStorage.setItem(key, toBeWritten);
    });
  }, [state]);
};
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

const useUpdateCssVariables = (state: TState) => {
  useEffect(() => {
    cssVariables.setTreeWidth(state.showTree ? state.treeSize : 0);
    if (state.showFormattingButtons) {
      cssVariables.setFormattingBar(40);
    } else {
      (async () => {
        await formattingBarUnmountAnimationDelay();
        cssVariables.setFormattingBar(0);
      })();
    }
  }, [state.showFormattingButtons, state.showTree]);
};

const useRefreshToken = ({ token }) => {
  const [fetch, { data, error }] = useLazyQuery(QUERY_USER.query, {
    fetchPolicy: 'network-only',
  });
  useEffect(() => {
    if (token) fetch();
  }, []);
  useEffect(() => {
    const session = QUERY_USER.path(data);
    if (session) {
      rootActionCreators.setSession(session.session);
      rootActionCreators.setSecrets(session.secrets);
    } else if (error) {
      rootActionCreators.setSession({ user: undefined, token: '' });
      rootActionCreators.setSecrets({
        google_api_key: undefined,
        google_client_id: undefined,
      });
    }
  }, [data, error]);
};
import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::root/store/store';
import { useHandleRouting } from '::app/hooks/handle-routing/handle-routing';

const mapState = (state: Store) => ({
  documentId: state.document.documentId,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const App: React.FC<Props & PropsFromRedux> = ({ session, documentId }) => {
  const [state, dispatch] = useReducer(appReducer, appInitialState);
  useEffect(() => {
    appActionCreators.setDispatch(dispatch);
  }, [dispatch]);

  useOnWindowResize([
    updateBreakpointState({
      breakpoint: 850,
      callback: appActionCreators.setIsOnMobile,
    }),
  ]);
  useDocumentEditedIndicator(state);
  useSaveStateToLocalStorage(state);
  useHandleRouting(documentId);
  useUpdateCssVariables(state);
  useRefreshToken({ token: session.token });
  return (
    <AppContext.Provider value={state}>
      <div className={appModule.app}>
        <Suspense fallback={<Void />}>
          <Editor state={state} />
        </Suspense>
        <Suspense fallback={<Void />}>
          <Menus state={state} dispatch={dispatch} session={session} />
        </Suspense>
      </div>
    </AppContext.Provider>
  );
};
const _ = connector(App);
export { _ as App };
