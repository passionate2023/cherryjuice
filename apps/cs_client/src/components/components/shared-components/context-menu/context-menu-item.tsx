import * as React from 'react';
import { joinClassNames } from '@cherryjuice/shared-helpers';
import { modContextMenu } from '::sass-modules';
import { ReactNode, useEffect, useState } from 'react';
import { Icon, Icons } from '@cherryjuice/icons';
import { ContextMenuWrapper } from '::root/components/shared-components/context-menu/context-menu-wrapper';

export type CMItem = Omit<
  ContextMenuItemProps,
  'hide' | 'activeItem' | 'setActiveItem'
>;
export type ContextMenuItemProps = {
  name: string;
  onClick: () => void;
  hide: () => void;
  node?: ReactNode;
  disabled?: boolean;
  active?: boolean;
  bottomSeparator?: boolean;
  hideOnClick?: boolean;
  items?: CMItem[];
  activeItem: string;
  setActiveItem: (name: string) => void;
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
  items = [],
  activeItem,
  setActiveItem,
}) => {
  const [CMShown, setCMShown] = useState(false);
  const hideSub = () => setCMShown(false);
  const showSub = () => {
    setCMShown(true);
    setActiveItem(name);
  };
  const onClickM = e => {
    if (!disabled && !items.length) {
      if (hideOnClick) hide();
      onClick();
      e.stopPropagation();
      e.preventDefault();
    }
  };
  useEffect(() => {
    if (activeItem !== name) {
      hideSub();
    }
  }, [activeItem]);
  return (
    <ContextMenuWrapper
      shown={CMShown}
      hide={hide}
      show={showSub}
      items={items}
      triggers={{ click: true, hover: true }}
    >
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
          {active ? <Icon name={Icons.material.check} size={14} /> : undefined}
        </span>
        <span className={modContextMenu.contextMenu__item__text}>
          {node || name}
        </span>
        {!!items.length && (
          <span className={modContextMenu.contextMenu__item__subItemsArrow}>
            <Icon name={Icons.material['triangle-right']} />
          </span>
        )}
      </div>
    </ContextMenuWrapper>
  );
};

export { ContextMenuItem };
