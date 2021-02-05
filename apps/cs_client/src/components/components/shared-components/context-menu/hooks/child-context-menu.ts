import { MouseEvent, useCallback, useState } from 'react';
import { Position } from '::shared-components/context-menu/context-menu';
export type ContextMenuItemContext = Record<string, any>;
export type ChildContextMenuProps<Context = ContextMenuItemContext> = {
  getIdOfActiveElement: (e: HTMLElement, activeElement: HTMLElement) => string;
  getActiveElement?: (e: HTMLElement) => HTMLElement;
  onSelectElement?: (id: string, context: Context) => void;
};
export type PositionReference = 'element' | 'cursor';
export const useChildContextMenu = <
  T = HTMLDivElement,
  Context = ContextMenuItemContext
>(
  {
    getIdOfActiveElement,
    getActiveElement = () => undefined,
    onSelectElement = () => undefined,
  }: ChildContextMenuProps<Context>,
  reference: PositionReference = 'cursor',
) => {
  const [position, setPosition] = useState<Position>([0, 0]);
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
      setPosition(
        reference === 'element'
          ? [
              boundingClientRect.x + boundingClientRect.width,
              boundingClientRect.y,
            ]
          : [e.clientX, e.clientY],
      );

      onSelectElement(id, context);
    }
    return { id, context };
  }, []);
  const hide = () => setPosition([0, 0]);
  const shown = position[0] > 0;

  return {
    show,
    shown,
    hide,
    position,
  };
};
