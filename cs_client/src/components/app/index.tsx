import appModule from '::sass-modules/app.scss';
import { cssVariables } from '::assets/styles/css-variables/set-css-variables';
import * as React from 'react';
import { useEffect, useReducer, useRef, Suspense } from 'react';
import { useHistory } from 'react-router-dom';
import { appActionCreators, appInitialState, appReducer } from './reducer';

// eager
import { ErrorBoundary } from '::shared-components/error-boundary';
import { Void } from '::shared-components/suspense-fallback/void';
// lazy
import { ToolBar } from '::lazy-components/index';
import { ErrorModal } from '::lazy-components/index';
import { Settings } from '::lazy-components/index';
import { Body } from '::lazy-components/index';
import { InfoBar } from '::lazy-components/index';

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
  const appRef = useRef<HTMLDivElement>();
  const treeRef = useRef<HTMLDivElement & { size: { width: number } }>();

  useOnWindowResize();
  useSaveStateToLocalStorage(state);
  useHandleRouting(state);
  return (
    <div
      className={appModule.app}
      ref={appRef}
      style={{
        ...{
          gridTemplateColumns: `${
            !state.showTree ? '0' : 'var(--tree-width) 1fr'
          }`,
        },
      }}
    >
      <ErrorBoundary>
        <Suspense fallback={<Void />}>
          <ToolBar
            showFormattingButtons={state.showFormattingButtons}
            isOnMobile={state.isOnMobile}
            dispatch={dispatch}
            // onResize={onResize}
          />
        </Suspense>
      </ErrorBoundary>

      <Suspense fallback={<Void />}>
        <Body
          dispatch={dispatch}
          // onResize={onResize}
          treeRef={treeRef}
          state={state}
        />
      </Suspense>
      <Suspense fallback={<Void />}>
        <InfoBar state={state} node={state.selectedNode} />
      </Suspense>
      {state.showSettings && (
        <Suspense fallback={<Void />}>
          <Settings dispatch={dispatch} />
        </Suspense>
      )}
      {state.error && (
        <Suspense fallback={<Void />}>
          <ErrorModal error={state.error} dispatch={dispatch} />
        </Suspense>
      )}
    </div>
  );
};

export { App };
