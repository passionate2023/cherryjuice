import * as React from 'react';
import { modContextMenu } from '::sass-modules';
import { useClickOutsideModal } from '::hooks/use-click-outside-modal';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { useLayoutEffect, useRef, useState } from 'react';
import {
  ContextMenuItem,
  ContextMenuItemProps,
} from '::root/components/shared-components/context-menu/context-menu-item';

export type ContextMenuProps = {
  hide: () => void;
  offset?: [number, number];
  items?: Omit<ContextMenuItemProps, 'hide'>[];
  position: [number, number];
};

const ContextMenu: React.FC<ContextMenuProps> = ({
  children,
  hide,
  offset = [0, 0],
  items,
  position,
}) => {
  const contextMenuR = useRef<HTMLDivElement>();
  useClickOutsideModal({
    callback: hide,
    selector: '.' + modContextMenu.contextMenu,
  });

  const [inverseX, setInverseX] = useState(0);
  const [inverseY, setInverseY] = useState(0);
  useLayoutEffect(() => {
    const boundingClientRect = contextMenuR.current.getBoundingClientRect();
    const x =
      window.innerWidth - boundingClientRect.x <
      contextMenuR.current.clientWidth;
    if (x) setInverseX(contextMenuR.current.clientWidth);
    const y =
      window.innerHeight - boundingClientRect.y <
      contextMenuR.current.clientHeight;
    if (y) setInverseY(contextMenuR.current.clientHeight);
  }, []);
  const offsetX = inverseX ? -offset[0] : offset[0];
  const offsetY = inverseY ? -offset[1] : offset[1];
  return (
    <div
      className={joinClassNames([modContextMenu.contextMenu])}
      style={{
        left: Math.max(position[0] - inverseX + offsetX, 0),
        top: Math.max(position[1] - inverseY + offsetY, 0),
      }}
      ref={contextMenuR}
    >
      {items
        ? items.map(item => (
            <ContextMenuItem {...item} key={item.name} hide={hide} />
          ))
        : children}
    </div>
  );
};

export { ContextMenu };
