import { MouseEvent, useCallback, useState } from 'react';
import { Position } from '::shared-components/context-menu/context-menu';
export type ContextMenuItemContext = Record<string, any>;
export type ChildContextMenuProps<Context = ContextMenuItemContext> = {
  getIdOfActiveElement: (e: HTMLElement, activeElement: HTMLElement) => string;
  getActiveElement?: (e: HTMLElement) => HTMLElement;
  onSelectElement?: (id: string, context: Context) => void;
};
const initialState = {
  offsetX: 0,
  offsetY: 0,
  anchorW: 0,
  anchorH: 0,
  anchorX: 0,
  anchorY: 0,
};
export type PositionPreferences = Pick<
  Position,
  'positionX' | 'positionY' | 'offsetX' | 'offsetY'
>;
const cursorPositionPreferences: PositionPreferences = {
  offsetY: 0,
  offsetX: 0,
  positionY: 'tt',
  positionX: 'rl',
};
export const useChildContextMenu = <
  T = HTMLDivElement,
  Context = ContextMenuItemContext
>(
  {
    getIdOfActiveElement,
    getActiveElement = () => undefined,
    onSelectElement = () => undefined,
  }: ChildContextMenuProps<Context>,
  positionPreferences?: PositionPreferences,
) => {
  const [position, setPosition] = useState<Position>(initialState);
  const show = useCallback((e: MouseEvent<T>) => {
    const target = e.target as HTMLElement;
    const activeElement = getActiveElement(target as HTMLElement);
    const id = getIdOfActiveElement(target as HTMLElement, activeElement);
    let context;
    if (activeElement && activeElement.dataset.cmiContext)
      try {
        context = JSON.parse(activeElement.dataset.cmiContext);
      } catch {
        context = {};
      }

    if (id) {
      if (!e.shiftKey) {
        e.preventDefault();
      }
      e.stopPropagation();
      const boundingClientRect = (
        activeElement || target
      ).getBoundingClientRect();
      let numbers: Position;
      if (positionPreferences) {
        numbers = {
          anchorX: boundingClientRect.x,
          anchorY: boundingClientRect.y,
          anchorH: boundingClientRect.height,
          anchorW: boundingClientRect.width,
          offsetY: 0,
          offsetX: 0,
          ...positionPreferences,
        };
      } else {
        numbers = {
          anchorX: e.clientX,
          anchorY: e.clientY,
          anchorH: 0,
          anchorW: 0,
          ...cursorPositionPreferences,
        };
      }
      setPosition(numbers);

      onSelectElement(id, context);
    }
    return { id, context };
  }, []);
  const hide = () => setPosition(initialState);
  const shown = position.anchorX > 0;

  return {
    show,
    shown,
    hide,
    position,
  };
};
