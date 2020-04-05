import appModule from '::sass-modules/app.scss';
import { cssVariables } from '::assets/styles/css-variables/set-css-variables';
import * as React from 'react';
import { useEffect, useReducer, Suspense } from 'react';
import { useHistory } from 'react-router-dom';
import { appActionCreators, appInitialState, appReducer } from './reducer';

// eager
import { Void } from '::shared-components/suspense-fallback/void';
// import { ApolloProvider } from '@apollo/react-common';
import { client } from '::graphql/apollo';
// lazy
const ApolloProvider = React.lazy(() =>
  import('@apollo/react-common').then(({ ApolloProvider }) => ({
    default: ApolloProvider,
  })),
);
const Editor = React.lazy(() => import('::app/editor'));
const ErrorModal = React.lazy(() => import('::shared-components/error-modal'));
const Settings = React.lazy(() => import('::app/menus/settings'));
const SelectFile = React.lazy(() => import('::app/menus/select-file'));
type Props = {};

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
const useOnWindowResize = (
  callbacks = [
    updateBreakpointState({
      breakpoint: 850,
      callback: appActionCreators.setIsOnMobile,
    }),
    cssVariables.setVH,
    cssVariables.setVW,
  ],
) => {
  useEffect(() => {
    const handle = () => {
      callbacks.forEach(callback => callback());
    };
    handle();
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, []);
};
const useHandleRouting = state => {
  const history = useHistory();
  if (history.location.hash) {
    history.push('/' + history.location.hash.substr(1));
  } else if (state.selectedFile) {
    if (history.location.pathname === '/')
      history.push('/' + state.selectedFile);
  }
};

const App: React.FC<Props> = () => {
  const [state, dispatch] = useReducer(appReducer, appInitialState);
  useEffect(() => {
    appActionCreators.setDispatch(dispatch);
  }, [dispatch]);

  useOnWindowResize();
  useSaveStateToLocalStorage(state);
  useHandleRouting(state);
  cssVariables.setTreeWidth(state.showTree ? state.treeSize : 0);
  return (
    <div className={appModule.app}>
      <Suspense fallback={<Void />}>
        <ApolloProvider client={client}>
          <Suspense fallback={<Void />}>
            <Editor state={state} />
          </Suspense>
          {state.showFileSelect && (
            <Suspense fallback={<Void />}>
              <SelectFile
                selectedFile={state.selectedFile}
                reloadFiles={state.reloadFiles}
              />
            </Suspense>
          )}
          {state.showSettings && (
            <Suspense fallback={<Void />}>
              <Settings dispatch={dispatch} />
            </Suspense>
          )}
          {state.error && (
            <Suspense fallback={<Void />}>
              <ErrorModal error={state.error} />
            </Suspense>
          )}
        </ApolloProvider>
      </Suspense>
    </div>
  );
};

export { App };
