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

const App: React.FC<Props> = () => {
  const history = useHistory();
  const [state, dispatch] = useReducer(appReducer, appInitialState);

  const appRef = useRef();
  const treeRef = useRef();

  const onResize = useCallback(() => {
    // @ts-ignore
    appRef.current.style.gridTemplateColumns = `${treeRef.current &&
      // @ts-ignore
      treeRef.current.size.width}px 1fr`;
  }, []);

  useEffect(() => {
    Object.entries(state).forEach(([key, value]) => {
      let toBeWritten =
        typeof value === 'object' ? JSON.stringify(value) : value;
      if (value !== undefined) localStorage.setItem(key, toBeWritten);
    });
  }, [state]);
  if (state.selectedFile && history.location.pathname === '/')
    history.push('/' + state.selectedFile);

  useEffect(() => {
    cssVariables.setVH();
    window.addEventListener('resize', () => {
      cssVariables.setVH();
    });
  }, []);
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
