import * as React from 'react';
import { modContextMenu } from '::sass-modules';
import { useClickOutsideModal } from '::hooks/use-click-outside-modal';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { useLayoutEffect, useRef, useState } from 'react';

export type ContextMenuProps = {
  hide: () => void;
  offset?: [number, number];
};

const ContextMenu: React.FC<ContextMenuProps> = ({
  children,
  hide,
  offset,
}) => {
  const contextMenuR = useRef<HTMLDivElement>();
  useClickOutsideModal({
    callback: hide,
    selector: '.' + modContextMenu.contextMenu,
  });

  const [inverseX, setInverseX] = useState(false);
  const [inverseY, setInverseY] = useState(false);
  useLayoutEffect(() => {
    const boundingClientRect = contextMenuR.current.getBoundingClientRect();
    const x =
      window.innerWidth - boundingClientRect.x <
      contextMenuR.current.clientWidth;
    if (x) setInverseX(x);
    const y =
      window.innerHeight - boundingClientRect.y <
      contextMenuR.current.clientHeight;
    if (y) setInverseY(y);
  }, []);
  return (
    <div
      className={joinClassNames([
        modContextMenu.contextMenu,
        [modContextMenu.contextMenuInverseX, inverseX],
        [modContextMenu.contextMenuInverseY, inverseY],
      ])}
      style={offset ? { left: offset[0], top: offset[1] } : undefined}
      ref={contextMenuR}
    >
      {children}
    </div>
  );
};

export { ContextMenu };
