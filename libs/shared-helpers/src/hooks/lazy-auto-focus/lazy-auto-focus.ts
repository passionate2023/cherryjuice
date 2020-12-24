import { MutableRefObject, useEffect } from 'react';
import { onEnteredViewPort } from '../../helpers/on-entered-viewport';

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
        });
        return () => {
          elementRef.current.blur();
          cleanup();
        };
      }
    }
  }, [lazyAutoFocus]);
};
