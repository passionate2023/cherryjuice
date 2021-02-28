import { Position } from '::root/popups/popper/components/popper-body';
import {
  bottomOverflow,
  leftOverflow,
  rightOverflow,
  topOverflow,
} from '::root/popups/popper/components/hooks/calculate-element-position/helpers/element-overflow';
import {
  bottomBottom,
  bottomTop,
  leftLeft,
  leftRight,
  rightLeft,
  rightRight,
  topBottom,
  topTop,
} from '::root/popups/popper/components/hooks/calculate-element-position/helpers/element-position';

export type PositionContext = {
  elementW;
  elementH;
  viewportH;
  viewportW;
};
export type Props = {
  position: Position;
  context: PositionContext;
};

export const calculateElementPosition = ({
  context,

  position,
}: Props) => {
  let x, y;
  if (position.positionX === 'lr') {
    x = leftRight(position, context);
    if (leftOverflow(x)) x = rightLeft(position);
  } else if (position.positionX === 'rl') {
    x = rightLeft(position);
    if (rightOverflow(x, context)) x = leftRight(position, context);
  } else if (position.positionX === 'rr') {
    x = rightRight(position, context);
    if (leftOverflow(x)) x = leftLeft(position);
  } else if (position.positionX === 'll') {
    x = leftLeft(position);
    if (rightOverflow(x, context)) x = rightRight(position, context);
  }

  if (position.positionY === 'tb') {
    y = topBottom(position, context);
    if (topOverflow(y)) y = bottomTop(position);
  } else if (position.positionY === 'bt') {
    y = bottomTop(position);
    if (bottomOverflow(y, context)) y = topBottom(position, context);
  } else if (position.positionY === 'tt') {
    y = topTop(position);
    if (bottomOverflow(y, context)) y = bottomBottom(position, context);
  } else if (position.positionY === 'bb') {
    y = bottomBottom(position, context);
    if (topOverflow(y)) y = topTop(position);
  }
  return { x, y };
};
