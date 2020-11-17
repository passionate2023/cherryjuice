import * as React from 'react';
import { modDialog } from '::sass-modules';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { useEffect, useRef, useState } from 'react';
import { ContextMenuWrapper } from '::root/components/shared-components/context-menu/context-menu-wrapper';
import { Icon, Icons } from '::root/components/shared-components/icon/icon';
import { ContextMenuItemProps } from '::root/components/shared-components/context-menu/context-menu-item';

export type MuteCallback = () => void;
type Props = {
  name: string;
  disabled: boolean;
  selected: boolean;
  active: boolean;
  onClick: MuteCallback;
  details?: JSX.Element;
  contextMenuOptions?: Omit<ContextMenuItemProps, 'hide'>[];
};
const DialogListItem: React.FC<Props> = ({
  name,
  disabled,
  active,
  selected,
  onClick,
  details,
  contextMenuOptions,
}) => {
  const itemRef = useRef<HTMLDivElement>();
  useEffect(() => {
    if (active) {
      const handle = setTimeout(() => {
        itemRef.current.scrollIntoView({
          behavior: 'auto',
          block: 'nearest',
          inline: 'nearest',
        });
      }, 1200);
      return () => {
        clearTimeout(handle);
      };
    }
  }, [active]);
  const [showModal, setShowModal] = useState(false);

  return (
    <div
      className={joinClassNames([
        modDialog.dialogListItem,
        [modDialog.dialogListItemFocused, selected],
        [modDialog.dialogListItemActive, active],
      ])}
      onClick={disabled ? undefined : onClick}
      tabIndex={0}
      onContextMenu={() => setShowModal(true)}
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
      {contextMenuOptions && (
        <div className={`${modDialog.dialogListItem__contextMenuButton} `}>
          <ContextMenuWrapper
            shown={showModal}
            hide={() => setShowModal(false)}
            show={() => setShowModal(true)}
            items={contextMenuOptions}
          >
            <Icon name={Icons.material.menu} loadAsInlineSVG={'force'} />
          </ContextMenuWrapper>
        </div>
      )}
    </div>
  );
};

export { DialogListItem };
