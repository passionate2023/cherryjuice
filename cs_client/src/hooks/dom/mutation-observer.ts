import { MutableRefObject, useEffect, useRef } from 'react';
const config: MutationObserverInit = {
  attributes: true,
  characterData: true,
  subtree: true,
  childList: true,
};
type TCallbackOptions = {
  disconnectAfter: number;
};
type TOptions = {
  mutationOptions: MutationObserverInit;
  callbackOptions: TCallbackOptions;
};
const useMutationObserver = (
  ref: MutableRefObject<HTMLElement | null>,
  callback: MutationCallback,
  { mutationOptions, callbackOptions }: TOptions = {
    mutationOptions: config,
    callbackOptions: { disconnectAfter: 0 },
  },
) => {
  const numberOfCalls = useRef<number>(0);
  useEffect(() => {
    if (ref.current) {
      const observer = new MutationObserver(
        callbackOptions.disconnectAfter
          ? (mutationsList, observer) => {
              callback(mutationsList, observer);
              numberOfCalls.current++;
              if (numberOfCalls.current === callbackOptions.disconnectAfter)
                observer.disconnect();
            }
          : callback,
      );
      observer.observe(ref.current, mutationOptions);
      return () => {
        observer.disconnect();
      };
    }
  }, [callback]);
};

export { useMutationObserver };
