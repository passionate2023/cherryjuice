import { PositionContext } from '::shared-components/context-menu/hooks/calculate-element-position/helpers/calculate-element-position';

export const leftOverflow = (x: number) => x < 0;
export const rightOverflow = (x: number, context: PositionContext) =>
  context.viewportW < x + context.elementW;
export const topOverflow = (y: number) => y < 0;
export const bottomOverflow = (y: number, context: PositionContext) =>
  context.viewportH < y + context.elementH;
