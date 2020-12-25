import * as React from 'react';
import { SplashScreen } from '::shared-components/splash-screen/splash-screen';
import { useEffect, useReducer } from 'react';
import { Void } from '::shared-components/react/void';
import { rootAC, rootR } from '::root/reducer';
const RootWithRedux = React.lazy(() => import('::root/root-with-redux'));
type Props = {};

export const Root: React.FC<Props> = () => {
  const [state, dispatch] = useReducer(rootR, undefined, () => ({
    ready: false,
  }));
  useEffect(() => {
    rootAC.init(dispatch);
  }, []);

  return (
    <>
      {!state.ready && <SplashScreen />}
      <React.Suspense fallback={<Void />}>
        <RootWithRedux />
      </React.Suspense>
    </>
  );
};
