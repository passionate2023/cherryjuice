import { useTimeout } from './use-timeout';
import { useEffect } from 'react';
import { AlertType } from '::types/react';
import { ac } from '::root/store/store';

const useQueryTimeout = (
  { queryData, queryError, queryVariables },
  { timeout = 15000, resourceName = '', showErrorAlert = false },
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
    ac.dialogs.setAlert({
      title: `Fetching ${resourceName} is taking longer then expected`,
      description: 'Please refresh the page',
      type: AlertType.Warning,
    });
    timeoutHasElapsed = true;
  }
  useEffect(() => {
    if (queryError && showErrorAlert)
      ac.dialogs.setAlert({
        title: `Could not fetch ${resourceName}`,
        description: 'Please refresh the page',
        type: AlertType.Error,
        error: queryError,
      });
  }, [queryError]);
  return timeoutHasElapsed;
};

export { useQueryTimeout };
