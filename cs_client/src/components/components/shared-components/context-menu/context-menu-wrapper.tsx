import * as React from 'react';
import { modContextMenu } from '::sass-modules';
import {
  ContextMenu,
  ContextMenuProps,
} from '::root/components/shared-components/context-menu/context-menu';
import { ReactNode } from 'react';

type Props = {
  show: boolean;
  contextMenu: ReactNode;
} & ContextMenuProps;

const ContextMenuWrapper: React.FC<Props> = ({
  children,
  show,
  contextMenu,
  hide,
}) => {
  return (
    <div className={modContextMenu.contextMenuWrapper}>
      {children}
      {show && <ContextMenu hide={hide}>{contextMenu}</ContextMenu>}
    </div>
  );
};

export { ContextMenuWrapper };
