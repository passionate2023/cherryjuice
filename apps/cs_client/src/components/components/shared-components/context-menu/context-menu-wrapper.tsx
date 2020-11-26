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
export type Trigger = 'click' | 'right-click' | 'hover';
type Props = {
  shown: boolean;
  customBody?: ReactNode;
  show?: () => void;
  position?: Position;
  triggers?: Partial<Record<Trigger, boolean | undefined>>;
  reference?: 'cursor' | 'element';
} & Omit<ContextMenuProps, 'position'>;

const ContextMenuWrapper: React.FC<Props> = ({
  triggers = { click: true },
  reference = 'element',
  children,
  ...props
}) => {
  const positionR = useRef<Position>([0, 0, 0, 0]);
  const ref = useRef<HTMLDivElement>();
  const show = e => {
    if (props.show) {
      if (!props.shown) {
        const boundingClientRect = ref.current.getBoundingClientRect();
        positionR.current =
          reference === 'element'
            ? [
                boundingClientRect.x + boundingClientRect.width,
                boundingClientRect.y,
                boundingClientRect.width,
                boundingClientRect.height,
              ]
            : [boundingClientRect.x, boundingClientRect.y, 0, 0];
        props.show();
      }
    }
    e.preventDefault();
  };
  return (
    <div
      className={joinClassNames([modContextMenu.contextMenuWrapper])}
      onClick={triggers.click && show}
      onMouseEnter={triggers.hover && show}
      onContextMenu={triggers['right-click'] && show}
      ref={ref}
    >
      {children}
      <Portal targetSelector={'.' + modApp.app}>
        {props.shown && (
          // @ts-ignore
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
