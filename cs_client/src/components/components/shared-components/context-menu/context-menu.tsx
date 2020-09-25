import * as React from 'react';
import { modContextMenu } from '::sass-modules';
import { useClickOutsideModal } from '::hooks/use-click-outside-modal';
import { joinClassNames } from '::helpers/dom/join-class-names';

export type ContextMenuProps = {
  hide: () => void;
  alignTo?: 'left' | 'right';
  offset?: [number, number];
};

const ContextMenu: React.FC<ContextMenuProps> = ({
  alignTo = 'left',
  children,
  hide,
  offset,
}) => {
  useClickOutsideModal({
    callback: hide,
    selector: '.' + modContextMenu.contextMenu,
  });
  return (
    <div
      className={joinClassNames([
        modContextMenu.contextMenu,
        [modContextMenu.contextMenuRightEdge, alignTo === 'right'],
      ])}
      style={offset ? { left: offset[0], top: offset[1] } : undefined}
    >
      {children}
    </div>
  );
};

export { ContextMenu };
