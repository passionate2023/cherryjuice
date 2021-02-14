import React, { ReactNode } from 'react';
import { useRef } from 'react';
import {
  useClickOutsideModal,
  joinClassNames,
  useModalKeyboardEvents,
} from '@cherryjuice/shared-helpers';
import {
  CMItem,
  ContextMenuItem,
} from '::root/popups/context-menu/context-menu-item';
import mod from './context-menu.scss';
import { Scrim } from '::root/popups/scrim/scrim';
import { useCalculateElementPosition } from '::root/popups/context-menu/hooks/calculate-element-position/calculate-element-position';
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

export type ContextMenuProps = {
  hide: () => void;
  level?: number;
  items?: CMItem[];
  position: Position;
  id: string;
  context: Record<string, any>;
  //
  showAsModal?: 'md' | 'mb';
  clickOutsideSelectorsWhitelist?: any[];
  children?: ReactNode;
  style?: {
    borderRadius?: number;
    paddingTop?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    paddingRight?: number;
    opacity?: number;
  };
};

const ContextMenu: React.FC<ContextMenuProps> = ({
  items,
  level = 0,
  hide,
  position,
  id,
  context,
  children,
  showAsModal,
  clickOutsideSelectorsWhitelist = [],
  style = {},
}) => {
  const ref = useRef<HTMLDivElement>();
  const { clkOProps } = useClickOutsideModal({
    callback: hide,
    assertions: [
      ...clickOutsideSelectorsWhitelist,
      {
        selector: '.' + mod.contextMenu,
      },
    ],
  });
  const keprops = useModalKeyboardEvents({
    dismiss: hide,
    focusableElementsSelector: [],
  });

  const { x, y } = useCalculateElementPosition(position, ref);
  return (
    <>
      {!!showAsModal && <Scrim onClick={hide} isShownOnTopOfDialog={true} />}
      <div
        {...clkOProps}
        {...keprops}
        className={joinClassNames([
          mod.contextMenu,
          [mod.contextMenuModal, !!showAsModal],
        ])}
        style={
          showAsModal
            ? { ...style }
            : {
                left: Math.max(x, 0),
                top: Math.max(y, 0),
                ...style,
              }
        }
        ref={ref}
      >
        {items
          ? items.map(item => (
              <ContextMenuItem
                {...item}
                key={item.name}
                hide={hide}
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

export { ContextMenu };
