import { MouseEvent, useCallback, useState } from 'react';
import { Position } from '::shared-components/context-menu/context-menu-wrapper-legacy';
export type ContextMenuItemContext = Record<string, any>;
export type ChildContextMenuProps<Context = ContextMenuItemContext> = {
  getIdOfActiveElement: (e: HTMLElement) => string;
  getActiveElement?: (e: HTMLElement) => HTMLElement;
  onSelectElement?: (id: string, context: Context) => void;
};

export const useChildContextMenu = <
  T = HTMLDivElement,
  Context = ContextMenuItemContext
>({
  getIdOfActiveElement,
  getActiveElement = () => undefined,
  onSelectElement = () => undefined,
}: ChildContextMenuProps<Context>) => {
  const [CMOffset, setCMOffset] = useState<Position>([0, 0, 0, 0]);
  const show = useCallback((e: MouseEvent<T>) => {
    if (!e.shiftKey) {
      e.preventDefault();
    }
    e.stopPropagation();
    const target = e.target;
    const id = getIdOfActiveElement(target as HTMLElement);
    const activeElement = getActiveElement(target as HTMLElement);
    let context;
    if (activeElement && activeElement.dataset.cmiContext)
      try {
        context = JSON.parse(activeElement.dataset.cmiContext);
      } catch {
        context = {};
      }

    if (id) {
      setCMOffset([e.clientX, e.clientY, 0, 0]);
      onSelectElement(id, context);
    }
    return { id, context };
  }, []);
  const hide = () => setCMOffset([0, 0, 0, 0]);
  const shown = CMOffset[0] > 0;

  return {
    show,
    shown,
    hide,
    position: CMOffset,
  };
};
