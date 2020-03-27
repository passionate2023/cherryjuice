import appModule from '::sass-modules/app.scss';
import * as React from 'react';
import { useCallback, useEffect, useReducer, useRef, Suspense } from 'react';
import { Route, useHistory } from 'react-router-dom';
// import { ToolBar } from './tool-bar';
const ToolBar = React.lazy(() => import('./tool-bar'));
import { SelectFile } from './menus/select-file';
import { InfoBar } from './info-bar';
// import { Document } from './document';
// import { Document } from '::lazy-components/index';
const Document = React.lazy(() => import('../app/document'));
// const Document = React.lazy(
//   () =>
//     new Promise((resolve, reject) => {
//       import('../lazy-components/document')
//         .then(result => resolve(result.default ? result : { default: result }))
//         .catch(reject);
//     }),
// );
// const Document = React.lazy(() => import('../lazy-components/document'));
import { appInitialState, appReducer } from './reducer';
import { ErrorBoundary } from '::shared-components/error-boundary';
import { ErrorModal } from '::shared-components/error-modal';
import { Settings } from '::app/menus/settings';
import { cssVariables } from '::assets/styles/css-variables/set-css-variables';

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
        <Suspense fallback={<div>Loading...</div>}>
          <ToolBar dispatch={dispatch} onResize={onResize} />
        </Suspense>
      </ErrorBoundary>

      {!state.selectedFile && history.location.pathname === '/' ? (
        <p>no file selected</p>
      ) : (
        <Route
          path={`/:file_id?/`}
          render={() => (
            <Suspense fallback={<div>Loading...</div>}>
              <Document
                dispatch={dispatch}
                onResize={onResize}
                treeRef={treeRef}
                showTree={state.showTree}
                selectedNode={state.selectedNode}
                recentNodes={state.recentNodes}
                selectedFile={state.selectedFile}
                saveDocument={state.saveDocument}
                reloadDocument={state.reloadDocument}
              />
            </Suspense>
          )}
        />
      )}
      <InfoBar node={state.selectedNode} />
      {state.showFileSelect && (
        <SelectFile selectedFile={state.selectedFile} dispatch={dispatch} />
      )}
      {state.showSettings && <Settings dispatch={dispatch} />}
      {state.error && <ErrorModal error={state.error} dispatch={dispatch} />}
    </div>
  );
};

export { App };
