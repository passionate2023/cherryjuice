import appModule from '::sass-modules/app.scss';
import { cssVariables } from '::assets/styles/css-variables/set-css-variables';
import * as React from 'react';
import { useCallback, useEffect, useReducer, useRef, Suspense } from 'react';
import { useHistory } from 'react-router-dom';
import { appInitialState, appReducer } from './reducer';

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
const useSetCssVariables = () => {
  useEffect(() => {
    cssVariables.setVH();
    window.addEventListener('resize', () => {
      cssVariables.setVH();
    });
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

  const appRef = useRef<HTMLDivElement>();
  const treeRef = useRef<HTMLDivElement & { size: { width: number } }>();

  const onResize = useCallback(() => {
    if (appRef.current && treeRef.current)
      appRef.current.style.gridTemplateColumns = `${treeRef.current &&
        treeRef.current.size.width}px 1fr`;
  }, []);

  useSetCssVariables();
  useSaveStateToLocalStorage(state);
  useHandleRouting(state);
  return (
    <div
      className={appModule.app}
      ref={appRef}
      style={{
        ...{
          gridTemplateColumns: `${
            !state.showTree ? '0' : state.treeSize
          }px 1fr`,
        },
      }}
    >
      <ErrorBoundary dispatch={dispatch}>
        <Suspense fallback={<Void />}>
          <ToolBar dispatch={dispatch} onResize={onResize} />
        </Suspense>
      </ErrorBoundary>

      <Suspense fallback={<Void />}>
        <Body
          dispatch={dispatch}
          onResize={onResize}
          treeRef={treeRef}
          state={state}
        />
      </Suspense>
      <Suspense fallback={<Void />}>
        <InfoBar node={state.selectedNode} />
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
