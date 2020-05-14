import { useTimeout } from './use-timeout';
import { appActionCreators } from '::app/reducer';
import { useEffect } from 'react';
import { AlertType } from '::types/react';

const useQueryTimeout = (
  { queryData, queryError, queryVariables },
  { timeout = 15000, resourceName = '' },
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
    appActionCreators.setAlert({
      title: `Fetching ${resourceName} is taking longer then expected`,
      description: 'Please refresh the page',
      type: AlertType.Warning,
    });
    timeoutHasElapsed = true;
  }
  useEffect(() => {
    // if (queryError)
    //   appActionCreators.setAlert({
    //     title: `Could not fetch ${resourceName}`,
    //     description: 'Please refresh the page',
    //     type: AlertType.Error,
    //     error: queryError,
    //   });
  }, [queryError]);
  return timeoutHasElapsed;
};

export { useQueryTimeout };
