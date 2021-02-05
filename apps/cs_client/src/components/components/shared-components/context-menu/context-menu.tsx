import React from 'react';
import { useRef } from 'react';
import { modContextMenu } from '::sass-modules';
import {
  useClickOutsideModal,
  joinClassNames,
  useModalKeyboardEvents,
} from '@cherryjuice/shared-helpers';
import {
  CMItem,
  ContextMenuItem,
} from '::root/components/shared-components/context-menu/context-menu-item';

import { connect, ConnectedProps } from 'react-redux';
import { Store } from '::store/store';
import { Scrim } from '::root/components/shared-components/scrim/scrim';
import { useCalculateElementPosition } from '::shared-components/context-menu/hooks/calculate-element-position/calculate-element-position';
export type Position = {
  anchorX: number;
  anchorY: number;
  anchorW?: number;
  anchorH?: number;
  offsetX?: number;
  offsetY?: number;
  positionX?: 'lr' | 'rl' | 'rr' | 'll';
  positionY?: 'bt' | 'tb' | 'tt' | 'bb';
};
const mapState = (state: Store) => ({
  isOnMd: state.root.isOnTb,
  isOnMb: state.root.isOnMb,
});
const connector = connect(mapState);
type PropsFromRedux = ConnectedProps<typeof connector>;

export type ContextMenuProps = {
  hide: () => void;
  offset?: [number, number];
  items?: CMItem[];
  position: Position;
  showAsModal?: 'md' | 'mb';
  clickOutsideSelectorsWhitelist?: any[];
  id: string;
  context: Record<string, any>;
  level?: number;
};

const ContextMenu: React.FC<ContextMenuProps & PropsFromRedux> = ({
  children,
  hide,
  items,
  position,
  showAsModal,
  isOnMd,
  isOnMb,
  clickOutsideSelectorsWhitelist = [],
  id,
  context,
  level = 0,
}) => {
  // const [activeItem, setActiveItem] = useState<string>(undefined);
  const contextMenuR = useRef<HTMLDivElement>();
  const { clkOProps } = useClickOutsideModal({
    callback: hide,
    assertions: [
      ...clickOutsideSelectorsWhitelist,
      {
        selector: '.' + modContextMenu.contextMenu,
      },
    ],
  });
  const keprops = useModalKeyboardEvents({
    dismiss: hide,
    focusableElementsSelector: [],
  });

  const modal =
    (showAsModal === 'mb' && isOnMb) || (showAsModal === 'md' && isOnMd);
  const { x, y } = useCalculateElementPosition(position, contextMenuR);
  return (
    <>
      {modal && <Scrim onClick={hide} isShownOnTopOfDialog={true} />}
      <div
        {...clkOProps}
        {...keprops}
        className={joinClassNames([
          modContextMenu.contextMenu,
          [modContextMenu.contextMenuModal, modal],
          [modContextMenu.contextMenuCustomBody, children],
        ])}
        style={
          modal
            ? undefined
            : {
                left: Math.max(x, 0),
                top: Math.max(y, 0),
              }
        }
        ref={contextMenuR}
      >
        {items
          ? items.map(item => (
              <ContextMenuItem
                {...item}
                key={item.name}
                hide={hide}
                // setActiveItem={setActiveItem}
                // activeItem={activeItem}
                id={id}
                context={context}
                level={level}
              />
            ))
          : children}
      </div>
    </>
  );
};

const _ = connector(ContextMenu);
export { _ as ContextMenu };
