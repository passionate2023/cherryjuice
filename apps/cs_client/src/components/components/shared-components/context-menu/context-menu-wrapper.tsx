import * as React from 'react';
import { modApp, modContextMenu } from '::sass-modules';
import {
  ContextMenu,
  ContextMenuProps,
} from '::root/components/shared-components/context-menu/context-menu';
import { ReactNode, useRef } from 'react';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { Portal } from '::root/components/app/components/editor/tool-bar/tool-bar';

export type Position = [number, number, number, number];
type Props = {
  shown: boolean;
  customBody?: ReactNode;
  show?: () => void;
  position?: Position;
} & Omit<ContextMenuProps, 'position'>;

const ContextMenuWrapper: React.FC<Props> = ({ children, ...props }) => {
  const positionR = useRef<Position>([0, 0, 0, 0]);
  const ref = useRef<HTMLDivElement>();
  return (
    <div
      className={joinClassNames([modContextMenu.contextMenuWrapper])}
      onClick={() => {
        if (props.show && !props.shown) {
          const boundingClientRect = ref.current.getBoundingClientRect();
          positionR.current = [
            boundingClientRect.x + boundingClientRect.width,
            boundingClientRect.y,
            boundingClientRect.width,
            boundingClientRect.height,
          ];
          props.show();
        }
      }}
      ref={ref}
    >
      {children}
      <Portal targetSelector={'.' + modApp.app}>
        {props.shown && (
          <ContextMenu
            {...props}
            position={props.position || positionR.current}
          >
            {props.customBody}
          </ContextMenu>
        )}
      </Portal>
    </div>
  );
};

export { ContextMenuWrapper };
