import { MutableRefObject, useEffect } from 'react';
import { isMoving$ } from '::root/components/shared-components/buttons/hooks/is-moving';

export const useLazyAutoFocus = (
  lazyAutoFocus: boolean,
  elementRef: MutableRefObject<HTMLElement>,
  comesFromUp?: boolean,
) => {
  useEffect(() => {
    if (elementRef.current) {
      if (lazyAutoFocus) {
        const cleanup = isMoving$({
          elementRef,
          onArrived: () => {
            elementRef.current.focus();
          },
          onStartingToGo: () => elementRef.current.blur(),
          comesFromUp,
        });
        return () => {
          elementRef.current.blur();
          cleanup();
        };
      }
    }
  }, [lazyAutoFocus]);
};
