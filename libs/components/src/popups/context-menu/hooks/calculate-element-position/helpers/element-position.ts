import { Position } from '::root/popups/context-menu/context-menu';
import { PositionContext } from '::root/popups/context-menu/hooks/calculate-element-position/helpers/calculate-element-position';
/**
 first side is that of the anchor
 second side is that of the element
 rightLeft means right of anchor , left of element
 */
export const leftLeft = (position: Position) =>
  position.anchorX + position.offsetX;
export const rightLeft = (position: Position) =>
  leftLeft(position) + position.anchorW;
export const leftRight = (position: Position, context: PositionContext) =>
  position.anchorX - context.elementW - position.offsetX;
export const rightRight = (position: Position, context: PositionContext) =>
  leftRight(position, context) + position.anchorW;

export const topTop = (position: Position) =>
  position.anchorY + position.offsetY;
export const topBottom = (position: Position, context: PositionContext) =>
  position.anchorY - position.offsetY - context.elementH;
export const bottomTop = (position: Position) =>
  position.anchorY + position.anchorH + position.offsetY;
export const bottomBottom = (position: Position, context: PositionContext) =>
  position.anchorY + position.anchorH - position.offsetY - context.elementH;
