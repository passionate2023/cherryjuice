import * as React from 'react';
import { modContextMenu } from '::sass-modules';
import {
  ContextMenu,
  ContextMenuProps,
} from '::root/components/shared-components/context-menu/context-menu';
import { ReactNode } from 'react';
import { joinClassNames } from '::helpers/dom/join-class-names';

type Props = {
  shown: boolean;
  contextMenu: ReactNode;
  show?: () => void;
} & ContextMenuProps;

const ContextMenuWrapper: React.FC<Props> = ({
  children,
  shown,
  contextMenu,
  hide,
  offset,
  show,
}) => {
  return (
    <div
      className={joinClassNames([
        modContextMenu.contextMenuWrapper,
        [modContextMenu.contextMenuWrapperVisible, shown],
      ])}
      onClick={show}
    >
      {children}
      {shown && (
        <ContextMenu hide={hide} offset={offset}>
          {contextMenu}
        </ContextMenu>
      )}
    </div>
  );
};

export { ContextMenuWrapper };
