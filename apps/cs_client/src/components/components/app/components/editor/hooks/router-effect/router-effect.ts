import { useEffect } from 'react';
import { routerToState } from '::app/components/editor/hooks/router-effect/state-to-router/router-to-state';
import { stateToRouter } from '::app/components/editor/hooks/router-effect/state-to-router/state-to-router';

const useRouterEffect = () => {
  useEffect(() => {
    routerToState();
    stateToRouter();
  }, []);
};

export { useRouterEffect };
