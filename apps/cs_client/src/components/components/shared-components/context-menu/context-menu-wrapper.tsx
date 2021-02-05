import * as React from 'react';
import { modApp } from '::sass-modules';
import {
  ContextMenu,
  ContextMenuProps,
} from '::root/components/shared-components/context-menu/context-menu';
import { MutableRefObject, useEffect, useRef } from 'react';
import { Portal } from '::root/components/app/components/editor/tool-bar/tool-bar';
import {
  ChildContextMenuProps,
  PositionPreferences,
  useChildContextMenu,
} from '::shared-components/context-menu/hooks/child-context-menu';
type renderCustomBody = ({ hide }) => JSX.Element;
type Props<T = HTMLDivElement> = {
  hookProps: ChildContextMenuProps;
  customBody?: JSX.Element | renderCustomBody;
  positionPreferences?: PositionPreferences;
  children: (props: {
    show: () => string;
    hide: () => undefined;
    shown: boolean;
    ref: MutableRefObject<T>;
  }) => JSX.Element;
} & Omit<ContextMenuProps, 'position' | 'id' | 'hide' | 'context'>;

const state = {
  hide: new Map<number, Set<() => undefined>>(),
};
const ContextMenuWrapper: React.FC<Props> = ({
  customBody,
  level,
  children,
  hookProps,
  positionPreferences,
  ...props
}) => {
  const { position, show, hide, shown } = useChildContextMenu(
    hookProps,
    positionPreferences,
  );

  const ref = useRef<HTMLDivElement>();
  const id = useRef<{ id: string; context: Record<string, any> }>({
    id: undefined,
    context: undefined,
  });
  const showM = e => {
    if (show) {
      state.hide[level].forEach(_hide => _hide());
      id.current = show(e);
    }
  };
  useEffect(() => {
    if (!state.hide[level]) state.hide[level] = new Set();
    state.hide[level].add(hide);
    return () => {
      state.hide[level].delete(hide);
    };
  }, []);

  return (
    <>
      {children({ shown, show: showM, ref, hide })}
      <Portal targetSelector={'.' + modApp.app}>
        {shown && (
          // @ts-ignore
          <ContextMenu
            {...props}
            hide={hide}
            position={position}
            id={id.current.id}
            context={id.current.context}
            level={level}
          >
            {typeof customBody === 'function'
              ? customBody({ hide })
              : customBody}
          </ContextMenu>
        )}
      </Portal>
    </>
  );
};

export { ContextMenuWrapper };
