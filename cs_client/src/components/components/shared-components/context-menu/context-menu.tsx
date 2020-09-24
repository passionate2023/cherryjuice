import * as React from 'react';
import { modContextMenu } from '::sass-modules';
import { useClickOutsideModal } from '::hooks/use-click-outside-modal';

export type ContextMenuProps = {
  hide: () => void;
};

const ContextMenu: React.FC<ContextMenuProps> = ({ children, hide }) => {
  useClickOutsideModal({
    callback: hide,
    selector: '.' + modContextMenu.contextMenu,
  });
  return <div className={modContextMenu.contextMenu}>{children}</div>;
};

export { ContextMenu };
