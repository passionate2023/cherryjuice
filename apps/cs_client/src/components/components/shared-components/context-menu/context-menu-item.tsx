import * as React from 'react';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { modContextMenu } from '::sass-modules';
import { ReactNode } from 'react';
import { Icon, Icons } from '::root/components/shared-components/icon/icon';

export type ContextMenuItemProps = {
  name: string;
  onClick: () => void;
  hide: () => void;
  node?: ReactNode;
  disabled?: boolean;
  active?: boolean;
  bottomSeparator?: boolean;
  hideOnClick?: boolean;
};

const ContextMenuItem: React.FC<ContextMenuItemProps> = ({
  node,
  name,
  disabled,
  onClick,
  bottomSeparator,
  hide,
  hideOnClick = true,
  active,
}) => {
  const onClickM = e => {
    if (!disabled) {
      if (hideOnClick) hide();
      onClick();
      e.stopPropagation();
      e.preventDefault();
    }
  };
  return (
    <div
      className={joinClassNames([
        modContextMenu.contextMenu__item,
        [modContextMenu.contextMenu__itemDisabled, disabled],
        [modContextMenu.contextMenu__itemBottomSeparator, bottomSeparator],
      ])}
      onClick={onClickM}
      {...(disabled && { 'data-disabled': disabled })}
    >
      <span className={modContextMenu.contextMenu__item__icon}>
        {active ? <Icon name={Icons.material.check} /> : undefined}
      </span>
      <span className={modContextMenu.contextMenu__item__text}>
        {node || name}
      </span>
    </div>
  );
};

export { ContextMenuItem };
