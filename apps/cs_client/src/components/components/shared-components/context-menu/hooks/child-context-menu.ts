import { MouseEvent, useCallback, useState } from 'react';
import { Position } from '::shared-components/context-menu/context-menu-wrapper-legacy';

export type ChildContextMenuProps = {
  getIdOfActiveElement: (e: HTMLElement) => string;
  onSelectElement?: (id: string) => void;
};

export const useChildContextMenu = <T = HTMLDivElement>({
  getIdOfActiveElement,
  onSelectElement = () => undefined,
}: ChildContextMenuProps) => {
  const [CMOffset, setCMOffset] = useState<Position>([0, 0, 0, 0]);
  const show = useCallback((e: MouseEvent<T>) => {
    if (!e.shiftKey) {
      e.preventDefault();
    }
    e.stopPropagation();
    const target = e.target;
    const activeElementId = getIdOfActiveElement(target as HTMLElement);
    if (activeElementId) {
      setCMOffset([e.clientX, e.clientY, 0, 0]);
      onSelectElement(activeElementId);
    }
    return activeElementId;
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
