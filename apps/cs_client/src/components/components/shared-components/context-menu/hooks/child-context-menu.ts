import { useCallback, useState } from 'react';
import { Position } from '::root/components/shared-components/context-menu/context-menu-wrapper';

type Props = {
  getIdOfActiveElement: (e: HTMLElement) => string;
  onSelectElement?: (id: string) => void;
};

export const useChildContextMenu = ({
  getIdOfActiveElement,
  onSelectElement = () => undefined,
}: Props) => {
  const [CMOffset, setCMOffset] = useState<Position>([0, 0, 0, 0]);
  const show = useCallback(e => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.target;
    const activeElementId = getIdOfActiveElement(target);
    if (activeElementId) {
      setCMOffset([e.clientX, e.clientY, 0, 0]);
      onSelectElement(activeElementId);
    }
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
