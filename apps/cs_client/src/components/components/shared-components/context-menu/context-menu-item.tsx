import * as React from 'react';
import { joinClassNames } from '@cherryjuice/shared-helpers';
import { modContextMenu } from '::sass-modules';
import { ReactNode } from 'react';
import { Icon } from '@cherryjuice/icons';
import { ContextMenuWrapper } from '::shared-components/context-menu/context-menu-wrapper';

export type CMItem = Omit<
  ContextMenuItemProps,
  'hide' | 'activeItem' | 'setActiveItem' | 'id' | 'context'
>;

type IsDisabled = (id: string) => boolean;
export type ContextMenuItemProps<Context = Record<string, any>> = {
  name: string;
  nameFactory?: (id: string, context: Context) => string;
  onClick: (id: string, context: Context) => void;
  context: Context;
  hide: () => void;
  node?: ReactNode;
  disabled?: boolean | IsDisabled;
  active?: boolean;
  bottomSeparator?: boolean;
  hideOnClick?: boolean;
  items?: CMItem[];
  // activeItem: string;
  // setActiveItem: (name: string) => void;
  id: string;
  level: number;
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
  id,
  context,
  nameFactory,
  level = 0,
}) => {
  // const [CMShown, setCMShown] = useState(false);
  // const hideSub = () => setCMShown(false);
  // const showSub = () => {
  //   setCMShown(true);
  //   setActiveItem(name);
  // };
  id = id || name;
  const isDisabled = typeof disabled === 'function' ? disabled(id) : disabled;
  const onClickM = e => {
    if (!isDisabled && !items.length) {
      if (hideOnClick) hide();
      onClick(id, context);
      e.stopPropagation();
      e.preventDefault();
    }
  };
  // useEffect(() => {
  //   if (activeItem !== name) {
  //     hideSub();
  //   }
  // }, [activeItem]);
  return (
    <ContextMenuWrapper
      // shown={CMShown}
      // hide={hide}
      // show={showSub}
      items={items}
      hookProps={{
        getIdOfActiveElement: target => {
          const row: HTMLElement = target.closest(
            '.' + modContextMenu.contextMenu__item,
          );
          if (row) return row.dataset.cmiId;
        },
        getActiveElement: target => {
          return target.closest('.' + modContextMenu.contextMenu__item);
        },
      }}
      positionPreferences={{
        positionX: 'rl',
        positionY: 'tt',
        offsetX: 0,
        offsetY: 0,
      }}
      // triggers={{ click: true, hover: true }}
      level={level + 1}
    >
      {({ ref, show }) => (
        <div
          className={joinClassNames([
            modContextMenu.contextMenu__item,
            [modContextMenu.contextMenu__itemDisabled, isDisabled],
            [modContextMenu.contextMenu__itemBottomSeparator, bottomSeparator],
          ])}
          onClick={isDisabled ? undefined : items.length ? show : onClickM}
          ref={ref}
          onMouseEnter={isDisabled ? undefined : show}
          data-cmi-id={id}
          {...(isDisabled && { 'data-disabled': isDisabled })}
        >
          <span className={modContextMenu.contextMenu__item__icon}>
            {active ? <Icon name={'check'} size={14} /> : undefined}
          </span>
          <span className={modContextMenu.contextMenu__item__text}>
            {node || nameFactory ? nameFactory(id, context) : name}
          </span>
          {!!items.length && (
            <span className={modContextMenu.contextMenu__item__subItemsArrow}>
              <Icon name={'triangle-right'} />
            </span>
          )}
        </div>
      )}
    </ContextMenuWrapper>
  );
};

export { ContextMenuItem };
