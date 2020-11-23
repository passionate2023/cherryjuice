import * as React from 'react';
import { modApp } from '::sass-modules';
import {
  ContextMenu,
  ContextMenuProps,
} from '::root/components/shared-components/context-menu/context-menu';
import { MouseEvent, MutableRefObject, ReactNode, useRef } from 'react';
import { Portal } from '::root/components/app/components/editor/tool-bar/tool-bar';
import { Position } from '::root/components/shared-components/context-menu/context-menu-wrapper';

type MouseEventHandler<T> = (e: MouseEvent<T>) => void;
type Props<T = HTMLDivElement> = {
  shown: boolean;
  customBody?: ReactNode;
  show?: MouseEventHandler<T>;
  reference?: 'cursor' | 'element';
  position?: Position;
  children: (props: {
    show: MouseEventHandler<T>;
    ref: MutableRefObject<T>;
  }) => JSX.Element;
} & Omit<ContextMenuProps, 'position'>;

const ContextMenuWrapper: React.FC<Props> = ({
  shown,
  customBody,
  show,
  reference = 'element',
  position,
  children,
  ...props
}) => {
  const positionR = useRef<Position>([0, 0, 0, 0]);
  const ref = useRef<HTMLDivElement>();
  const showM = e => {
    if (show) {
      if (!shown) {
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
        show(e);
      }
    }
  };
  return (
    <>
      {children({ show: showM, ref })}
      <Portal targetSelector={'.' + modApp.app}>
        {shown && (
          // @ts-ignore
          <ContextMenu {...props} position={position || positionR.current}>
            {customBody}
          </ContextMenu>
        )}
      </Portal>
    </>
  );
};

export { ContextMenuWrapper };
