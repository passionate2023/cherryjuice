// https://gist.github.com/SleepWalker/da5636b1abcbaff48c4d#gistcomment-2577818
import { TouchEvent } from 'react';

export type GestureHandlerProps = {
  onRight?: Function;
  onLeft?: Function;
  onTop?: Function;
  onBottom?: Function;
  onTap?: Function;
  minimumLength?: number;
};
const createGesturesHandler = ({
  onRight,
  onLeft,
  onTop,
  onBottom,
  onTap,
  minimumLength = 0,
}: GestureHandlerProps) => {
  const pageWidth = window.innerWidth || document.body.clientWidth;
  const treshold = Math.max(1, Math.floor(0.01 * pageWidth));
  let touchstartX = 0;
  let touchstartY = 0;
  let touchendX = 0;
  let touchendY = 0;

  const limit = Math.tan(((45 * 1.5) / 180) * Math.PI);
  const handleGesture = () => {
    const x = touchendX - touchstartX;
    const y = touchendY - touchstartY;
    const xy = Math.abs(x / y);
    const yx = Math.abs(y / x);
    if (Math.abs(x) > treshold || Math.abs(y) > treshold) {
      if (yx <= limit && Math.abs(x) > minimumLength) {
        if (x < 0) {
          if (onLeft) onLeft();
        } else {
          if (onRight) onRight();
        }
      }
      if (xy <= limit && Math.abs(y) > minimumLength) {
        if (y < 0) {
          if (onTop) onTop();
        } else {
          if (onBottom) onBottom();
        }
      }
    } else {
      if (onTap) onTap();
    }
  };

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchstartX = event.changedTouches[0].screenX;
    touchstartY = event.changedTouches[0].screenY;
  };
  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    touchendX = event.changedTouches[0].screenX;
    touchendY = event.changedTouches[0].screenY;
    handleGesture();
  };
  return { onTouchStart, onTouchEnd };
};

export { createGesturesHandler };
