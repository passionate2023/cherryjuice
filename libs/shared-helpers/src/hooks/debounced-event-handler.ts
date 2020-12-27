import { useCallback, useRef } from 'react';

export const useDebouncedEventHandler = (
  callback: (value: string) => void,
  delay,
) => {
  const pending = useRef<any>();

  return useCallback(e => {
    if (pending.current) {
      clearTimeout(pending.current);
    }
    const value = e.target.value;
    pending.current = setTimeout(() => callback(value), delay);
  }, []);
};
