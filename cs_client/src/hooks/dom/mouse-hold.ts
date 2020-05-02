import { useCallback, useRef } from 'react';

const useMouseHold = ({
  onMouseHold,
  callbackProps,
  minHoldDuration = 1500,
}) => {
  const timer = useRef<any>();
  const onMouseDown = useCallback(() => {
    timer.current = setTimeout(
      () => onMouseHold(callbackProps),
      minHoldDuration,
    );
  }, []);
  const onMouseUp = useCallback(() => {
    clearTimeout(timer.current);
  }, []);
  return {
    onTouchStart: onMouseDown,
    onTouchEnd: onMouseUp,
    onMouseDown: onMouseDown,
    onMouseUp: onMouseUp,
    onMouseLeave: onMouseUp,
  };
};

export { useMouseHold };
