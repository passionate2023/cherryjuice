import { useCallback } from 'react';

const useDelayedCallback = (
  immediateCallback: Function,
  delayedCallback: Function,
  delay = 350,
) => {
  return useCallback(
    (...args) => {
      immediateCallback(...args);
      setTimeout(() => {
        delayedCallback(...args);
      }, delay);
    },
    [delayedCallback, delay],
  );
};

export { useDelayedCallback };
