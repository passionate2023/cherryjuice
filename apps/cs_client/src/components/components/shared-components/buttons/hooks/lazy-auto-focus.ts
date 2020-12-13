import { MutableRefObject, useEffect } from 'react';
import { onEnteredViewPort } from '::root/components/shared-components/buttons/hooks/on-entered-viewport';

export const useLazyAutoFocus = (
  lazyAutoFocus: boolean,
  elementRef: MutableRefObject<HTMLElement>,
) => {
  useEffect(() => {
    if (elementRef.current) {
      if (lazyAutoFocus) {
        const cleanup = onEnteredViewPort({
          elementRef,
          onEntered: () => {
            elementRef.current.focus();
          },
          onExited: () => elementRef.current.blur(),
        });
        return () => {
          elementRef.current.blur();
          cleanup();
        };
      }
    }
  }, [lazyAutoFocus]);
};
