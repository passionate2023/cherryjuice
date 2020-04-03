import { useTimeout } from './use-timeout';
import { appActionCreators } from '::app/reducer';
import { useEffect } from 'react';

const useQueryTimeout = (
  { queryData, queryError, queryVariables },
  timeout = 15000,
) => {
  let timeoutHasElapsed = false;
  const timer = useTimeout({
    timeout: timeout,
    id: JSON.stringify(queryVariables),
  });
  if (
    !queryError &&
    !queryData &&
    timer.timeHasElapsed &&
    timer.id === JSON.stringify(queryVariables)
  ) {
    appActionCreators.throwError(
      new Error('Request has timed-out. please refresh'),
    );
    timeoutHasElapsed = true;
  }
  useEffect(() => {
    if (queryError) appActionCreators.throwError(queryError);
  }, [queryError]);
  return timeoutHasElapsed;
};

export { useQueryTimeout };
