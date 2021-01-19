import * as React from 'react';
import { modApp } from '::sass-modules';
import {
  ContextMenu,
  ContextMenuProps,
} from '::root/components/shared-components/context-menu/context-menu';
import { MutableRefObject, ReactNode, useRef } from 'react';
import { Portal } from '::root/components/app/components/editor/tool-bar/tool-bar';
import { Position } from '::shared-components/context-menu/context-menu-wrapper-legacy';
import {
  ChildContextMenuProps,
  useChildContextMenu,
} from '::shared-components/context-menu/hooks/child-context-menu';

type Props<T = HTMLDivElement> = {
  hookProps: ChildContextMenuProps;
  // shown: boolean;
  customBody?: ReactNode;
  // show?: (e: MouseEvent<T>) => string;
  reference?: 'cursor' | 'element';
  // position?: Position;
  children: (props: {
    show: () => string;
    ref: MutableRefObject<T>;
  }) => JSX.Element;
} & Omit<ContextMenuProps, 'position' | 'id' | 'hide'>;

const ContextMenuWrapper: React.FC<Props> = ({
  // shown,
  customBody,
  // show,
  reference = 'element',
  // position,
  children,
  hookProps,
  ...props
}) => {
  const { position, show, hide, shown } = useChildContextMenu(hookProps);

  const positionR = useRef<Position>([0, 0, 0, 0]);
  const ref = useRef<HTMLDivElement>();
  const id = useRef<string>();
  const showM = e => {
    if (show) {
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
      id.current = show(e);
    }
  };
  return (
    <>
      {children({ show: showM, ref })}
      <Portal targetSelector={'.' + modApp.app}>
        {shown && (
          // @ts-ignore
          <ContextMenu
            {...props}
            hide={hide}
            position={position || positionR.current}
            id={id.current}
          >
            {customBody}
          </ContextMenu>
        )}
      </Portal>
    </>
  );
};

export { ContextMenuWrapper };
