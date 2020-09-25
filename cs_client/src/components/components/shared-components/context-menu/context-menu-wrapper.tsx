import * as React from 'react';
import { modContextMenu } from '::sass-modules';
import {
  ContextMenu,
  ContextMenuProps,
} from '::root/components/shared-components/context-menu/context-menu';
import { ReactNode } from 'react';
import { joinClassNames } from '::helpers/dom/join-class-names';

type Props = {
  show: boolean;
  contextMenu: ReactNode;
} & ContextMenuProps;

const ContextMenuWrapper: React.FC<Props> = ({
  children,
  show,
  contextMenu,
  hide,
  alignTo,
  offset,
}) => {
  return (
    <div className={joinClassNames([modContextMenu.contextMenuWrapper])}>
      {children}
      {show && (
        <ContextMenu hide={hide} alignTo={alignTo} offset={offset}>
          {contextMenu}
        </ContextMenu>
      )}
    </div>
  );
};

export { ContextMenuWrapper };
