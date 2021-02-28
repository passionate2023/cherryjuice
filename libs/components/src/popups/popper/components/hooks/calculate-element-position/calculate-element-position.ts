import { Position } from '::root/popups/popper/components/popper-body';
import { MutableRefObject, useLayoutEffect, useState } from 'react';
import { calculateElementPosition } from '::root/popups/popper/components/hooks/calculate-element-position/helpers/calculate-element-position';

export const useCalculateElementPosition = (
  position: Position,
  elementRef: MutableRefObject<HTMLDivElement>,
) => {
  const [x, setX] = useState(position.anchorX);
  const [y, setY] = useState(position.anchorY);
  useLayoutEffect(() => {
    const boundingClientRect = elementRef.current.getBoundingClientRect();
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    const elementW = boundingClientRect.width;
    const elementH = boundingClientRect.height;

    const { x, y } = calculateElementPosition({
      context: {
        elementH,
        elementW,
        viewportH,
        viewportW,
      },
      position,
    });
    setX(x);
    setY(y);
  }, [elementRef.current]);
  return { x, y };
};
