import * as React from 'react';
import { joinClassNames } from '@cherryjuice/shared-helpers';
import mod from './context-menu-item.scss';
import { ReactNode } from 'react';
import { Icon } from '@cherryjuice/icons';
import { ContextMenu } from '::root/popups';

export type CMItem = Omit<
  ContextMenuItemProps,
  'hide' | 'activeItem' | 'setActiveItem' | 'id' | 'context' | 'level'
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
    <ContextMenu
      // shown={CMShown}
      // hide={hide}
      // show={showSub}
      items={items}
      getContext={{
        getIdOfActiveElement: target => {
          const row: HTMLElement = target.closest('.' + mod.contextMenuItem);
          if (row) return row.dataset.cmiId;
        },
        getActiveElement: target => {
          return target.closest('.' + mod.contextMenuItem);
        },
      }}
      positionPreferences={{
        positionX: 'rl',
        positionY: 'tt',
        offsetX: 0,
        offsetY: -5,
      }}
      level={level + 1}
    >
      {({ show, shown }) => (
        <div
          className={joinClassNames([
            mod.contextMenuItem,
            [mod.contextMenuItemDisabled, isDisabled],
            [mod.contextMenuItemBottomSeparator, bottomSeparator],
            shown && mod.contextMenuItemShown,
          ])}
          onClick={isDisabled ? undefined : items.length ? show : onClickM}
          onMouseEnter={isDisabled ? undefined : show}
          data-cmi-id={id}
          {...(isDisabled && { 'data-disabled': isDisabled })}
        >
          <span className={mod.contextMenuItem__icon}>
            {active ? <Icon name={'check'} size={14} /> : undefined}
          </span>
          <span className={mod.contextMenuItem__text}>
            {node || nameFactory ? nameFactory(id, context) : name}
          </span>
          {!!items.length && (
            <span className={mod.contextMenuItem__subItemsArrow}>
              <Icon name={'triangle-right'} />
            </span>
          )}
        </div>
      )}
    </ContextMenu>
  );
};

export { ContextMenuItem };
