import * as React from 'react';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { modContextMenu } from '::sass-modules';
import { ReactNode } from 'react';

export type ContextMenuItemProps = {
  node?: ReactNode;
  name: string;
  disabled?: boolean;
  onClick: () => void;
  bottomSeparator?: boolean;
};

const ContextMenuItem: React.FC<ContextMenuItemProps> = ({
  node,
  name,
  disabled,
  onClick,
  bottomSeparator,
}) => {
  return (
    <div
      className={joinClassNames([
        modContextMenu.contextMenu__item,
        [modContextMenu.contextMenu__itemDisabled, disabled],
        [modContextMenu.contextMenu__itemBottomSeparator, bottomSeparator],
      ])}
      onClick={disabled ? undefined : onClick}
      {...(disabled && { 'data-disabled': disabled })}
    >
      {node || name}
    </div>
  );
};

export { ContextMenuItem };
