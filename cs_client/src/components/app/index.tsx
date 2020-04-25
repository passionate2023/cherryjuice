import appModule from '::sass-modules/app.scss';
import { cssVariables } from '::assets/styles/css-variables/set-css-variables';
import * as React from 'react';
import { useEffect, useReducer, Suspense } from 'react';
import { useHistory } from 'react-router-dom';
import {
  appActionCreators,
  appInitialState,
  appReducer,
  TState,
} from './reducer';
import { Void } from '::shared-components/suspense-fallback/void';
import { formattingBarUnmountAnimationDelay } from './editor/tool-bar/groups/formatting-buttons';

const Menus = React.lazy(() => import('::app/menus'));

const Editor = React.lazy(() => import('::app/editor'));

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
  useEffect(() => {
    if (state.selectedFile) {
      if (history.location.pathname === '/')
        history.push('/' + state.selectedFile);
    }
  }, [state.selectedFile]);
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
const App: React.FC<Props> = () => {
  const [state, dispatch] = useReducer(appReducer, appInitialState);
  useEffect(() => {
    appActionCreators.setDispatch(dispatch);
  }, [dispatch]);

  useOnWindowResize();
  useSaveStateToLocalStorage(state);
  useHandleRouting(state);
  useUpdateCssVariables(state);

  return (
    <div className={appModule.app}>
      <Suspense fallback={<Void />}>
        <Editor state={state} />
      </Suspense>
      <Suspense fallback={<Void />}>
        <Menus state={state} dispatch={dispatch} />
      </Suspense>
    </div>
  );
};

export { App };
