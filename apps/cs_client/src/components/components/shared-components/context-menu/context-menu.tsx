import * as React from 'react';
import { modContextMenu } from '::sass-modules';
import { useClickOutsideModal } from '::hooks/use-click-outside-modal';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { useLayoutEffect, useRef, useState } from 'react';
import {
  ContextMenuItem,
  ContextMenuItemProps,
} from '::root/components/shared-components/context-menu/context-menu-item';

import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::store/store';
import { Scrim } from '::root/components/shared-components/scrim/scrim';

const mapState = (state: Store) => ({
  isOnMd: state.root.isOnMd,
  isOnMb: state.root.isOnMb,
});
const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

export type ContextMenuProps = {
  hide: () => void;
  offset?: [number, number];
  items?: Omit<ContextMenuItemProps, 'hide'>[];
  position: [number, number];
  showAsModal?: 'md' | 'mb';
};

const ContextMenu: React.FC<ContextMenuProps & PropsFromRedux> = ({
  children,
  hide,
  offset = [0, 0],
  items,
  position,
  showAsModal,
  isOnMd,
  isOnMb,
}) => {
  const contextMenuR = useRef<HTMLDivElement>();
  useClickOutsideModal({
    callback: hide,
    selector: '.' + modContextMenu.contextMenu,
  });

  const [inverseX, setInverseX] = useState(0);
  const [inverseY, setInverseY] = useState(0);
  useLayoutEffect(() => {
    const boundingClientRect = contextMenuR.current.getBoundingClientRect();
    const x =
      window.innerWidth - boundingClientRect.x <
      contextMenuR.current.clientWidth;
    if (x) setInverseX(contextMenuR.current.clientWidth);
    const y =
      window.innerHeight - boundingClientRect.y <
      contextMenuR.current.clientHeight;
    if (y) setInverseY(contextMenuR.current.clientHeight);
  }, []);
  const offsetX = inverseX ? -offset[0] : offset[0];
  const offsetY = inverseY ? -offset[1] : offset[1];
  const modal =
    (showAsModal === 'mb' && isOnMb) || (showAsModal === 'md' && isOnMd);
  return (
    <>
      {modal && <Scrim onClick={hide} isShownOnTopOfDialog={true} />}
      <div
        className={joinClassNames([
          modContextMenu.contextMenu,
          [modContextMenu.contextMenuModal, modal],
        ])}
        style={
          modal
            ? undefined
            : {
                left: Math.max(position[0] - inverseX + offsetX, 0),
                top: Math.max(position[1] - inverseY + offsetY, 0),
              }
        }
        ref={contextMenuR}
      >
        {items
          ? items.map(item => (
              <ContextMenuItem {...item} key={item.name} hide={hide} />
            ))
          : children}
      </div>
    </>
  );
};

const _ = connector(ContextMenu);
export { _ as ContextMenu };
