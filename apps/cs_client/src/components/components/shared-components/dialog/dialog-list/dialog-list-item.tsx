import * as React from 'react';
import { modDialog } from '::sass-modules';
import { joinClassNames } from '@cherryjuice/shared-helpers';
import { memo, useEffect, useRef } from 'react';
import { Icon, Icons } from '@cherryjuice/icons';
import { CMItem } from '::root/components/shared-components/context-menu/context-menu-item';
import { ContextMenuWrapper } from '::shared-components/context-menu/context-menu-wrapper';

const onContextMenu = e => {
  e.preventDefault();
  e.stopPropagation();
};

export type MuteCallback = () => void;
type Props = {
  name: string;
  disabled: boolean;
  selected: boolean;
  active: boolean;
  onClick: MuteCallback;
  details?: JSX.Element;
  cmItems?: CMItem[];
  id: string;
};
const DialogListItem: React.FC<Props> = ({
  name,
  disabled,
  active,
  selected,
  onClick,
  details,
  cmItems,
  id,
}) => {
  const itemRef = useRef<HTMLDivElement>();
  useEffect(() => {
    if (active) {
      const handle = setTimeout(() => {
        itemRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest',
        });
      }, 1400);
      return () => {
        clearTimeout(handle);
      };
    }
  }, [active]);

  return (
    <div
      className={joinClassNames([
        modDialog.dialogListItem,
        [modDialog.dialogListItemFocused, selected],
        [modDialog.dialogListItemActive, active],
      ])}
      onClick={disabled ? undefined : onClick}
      tabIndex={0}
      onContextMenu={onContextMenu}
      ref={itemRef}
    >
      <div
        className={joinClassNames([
          modDialog.dialogListItem__body,
          [modDialog.dialogListItem__bodyDisabled, disabled],
        ])}
      >
        <span className={`${modDialog.dialogListItem__name} `}>{name}</span>

        <span className={`${modDialog.dialogListItem__details} `}>
          {details}
        </span>
      </div>
      {cmItems && (
        <ContextMenuWrapper
          items={cmItems}
          hookProps={{
            getIdOfActiveElement: () => id,
            getActiveElement: () => document.querySelector(`[data-id=${id}]`),
          }}
        >
          {({ ref, show }) => (
            <div
              className={`${modDialog.dialogListItem__contextMenuButton} `}
              ref={ref}
              onClick={show}
              data-id={id}
            >
              <Icon name={Icons.material.menu} />
            </div>
          )}
        </ContextMenuWrapper>
      )}
    </div>
  );
};

const M = memo(DialogListItem);
export { M as DialogListItem };
