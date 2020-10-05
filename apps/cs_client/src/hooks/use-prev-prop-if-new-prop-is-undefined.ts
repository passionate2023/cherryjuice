import { useEffect, useRef } from 'react';

const usePrevPropIfNewPropIsUndefined = <T>(newProps: T): T => {
  const prevProps = useRef(newProps);
  useEffect(() => {
    if (newProps) {
      prevProps.current = newProps;
    }
  }, [newProps]);
  return prevProps.current;
};
export { usePrevPropIfNewPropIsUndefined };
