import { Position } from '::shared-components/context-menu/context-menu';
import { MutableRefObject, useLayoutEffect, useState } from 'react';
import { calculateElementPosition } from '::shared-components/context-menu/hooks/calculate-element-position/helpers/calculate-element-position';

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
  }, []);
  return { x, y };
};
