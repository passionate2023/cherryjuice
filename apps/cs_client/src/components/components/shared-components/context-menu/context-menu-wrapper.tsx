import * as React from 'react';
import { modApp, modContextMenu } from '::sass-modules';
import {
  ContextMenu,
  ContextMenuProps,
} from '::root/components/shared-components/context-menu/context-menu';
import { ReactNode, useRef } from 'react';
import { joinClassNames } from '::helpers/dom/join-class-names';
import { Portal } from '::root/components/app/components/editor/tool-bar/tool-bar';

type Props = {
  shown: boolean;
  customBody?: ReactNode;
  show?: () => void;
  position?: [number, number];
} & Omit<ContextMenuProps, 'position'>;

const ContextMenuWrapper: React.FC<Props> = props => {
  const positionR = useRef<[number, number]>([0, 0]);
  return (
    <div
      className={joinClassNames([modContextMenu.contextMenuWrapper])}
      onClick={e => {
        if (props.show && !props.shown) {
          positionR.current = [e.clientX, e.clientY];
          props.show();
        }
      }}
    >
      {props.children}
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
