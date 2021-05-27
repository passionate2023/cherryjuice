import * as React from 'react';
import { SplashScreen } from '::shared-components/splash-screen/splash-screen';
import { useEffect, useReducer, useRef } from 'react';
import { Void } from '::shared-components/react/void';
import { rootAC, rootR } from '::root/reducer';
const RootWithRedux = React.lazy(() => import('::root/root-with-redux'));

const skipLoader = process.env.NODE_ENV !== 'production';
export const Root: React.FC = () => {
  const [state, dispatch] = useReducer(rootR, undefined, () => ({
    ready: false,
    showLoader: false,
  }));
  useEffect(() => {
    rootAC.init(dispatch);
  }, []);
  const interval = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    if (!skipLoader) {
      clearTimeout(interval.current);
      if (!state.ready)
        interval.current = setTimeout(() => {
          rootAC.showLoader(true);
          setTimeout(() => {
            rootAC.hideLoader();
          }, 1500);
        }, 800);
    }
  }, [state.ready]);

  return (
    <>
      {!skipLoader && (!state.ready || state.showLoader) && <SplashScreen />}
      <React.Suspense fallback={<Void />}>
        {!state.showLoader && <RootWithRedux />}
      </React.Suspense>
    </>
  );
};
