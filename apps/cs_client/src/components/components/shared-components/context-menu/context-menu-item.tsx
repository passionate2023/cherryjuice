import * as React from 'react';
import { joinClassNames } from '@cherryjuice/shared-helpers';
import { modContextMenu } from '::sass-modules';
import { ReactNode, useEffect, useState } from 'react';
import { Icon, Icons } from '@cherryjuice/icons';
import { ContextMenuWrapperLegacy } from '::shared-components/context-menu/context-menu-wrapper-legacy';

export type CMItem = Omit<
  ContextMenuItemProps,
  'hide' | 'activeItem' | 'setActiveItem' | 'id'
>;

type IsDisabled = (id: string) => boolean;
export type ContextMenuItemProps = {
  name: string;
  onClick: (id: string) => void;
  hide: () => void;
  node?: ReactNode;
  disabled?: boolean | IsDisabled;
  active?: boolean;
  bottomSeparator?: boolean;
  hideOnClick?: boolean;
  items?: CMItem[];
  activeItem: string;
  setActiveItem: (name: string) => void;
  id: string;
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
  id,
}) => {
  const [CMShown, setCMShown] = useState(false);
  const hideSub = () => setCMShown(false);
  const showSub = () => {
    setCMShown(true);
    setActiveItem(name);
  };
  const isDisabled = typeof disabled === 'function' ? disabled(id) : disabled;
  const onClickM = e => {
    if (!isDisabled && !items.length) {
      if (hideOnClick) hide();
      onClick(id);
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
    <ContextMenuWrapperLegacy
      shown={CMShown}
      hide={hide}
      show={showSub}
      items={items}
      triggers={{ click: true, hover: true }}
    >
      <div
        className={joinClassNames([
          modContextMenu.contextMenu__item,
          [modContextMenu.contextMenu__itemDisabled, isDisabled],
          [modContextMenu.contextMenu__itemBottomSeparator, bottomSeparator],
        ])}
        onClick={onClickM}
        {...(isDisabled && { 'data-disabled': isDisabled })}
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
    </ContextMenuWrapperLegacy>
  );
};

export { ContextMenuItem };
