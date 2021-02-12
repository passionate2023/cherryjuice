import * as React from 'react';
import {
  ContextMenu,
  ContextMenuProps,
} from '::root/popups/context-menu/context-menu';
import { useEffect, useRef, MouseEvent } from 'react';
import { Portal } from '::root/unclassified/portal/portal';
import {
  ChildContextMenuProps,
  PositionPreferences,
  useChildContextMenu,
} from '::root/popups/context-menu/hooks/child-context-menu';
import { CMItem } from '::root/popups/context-menu/context-menu-item';
type renderCustomBody = ({ hide }) => JSX.Element;
type renderChildren = (props: {
  show: (e: MouseEvent<HTMLDivElement>) => void;
  hide: () => void;
  shown: boolean;
}) => JSX.Element;

type Props = {
  hookProps: ChildContextMenuProps;
  customBody?: JSX.Element | renderCustomBody;
  positionPreferences?: PositionPreferences;
  children: renderChildren;
  items?: CMItem[];
} & Pick<
  ContextMenuProps,
  'clickOutsideSelectorsWhitelist' | 'showAsModal' | 'level' | 'style'
>;

const state = {
  root: '',
  hide: new Map<number, Set<() => undefined>>(),
};
export const setContextMenusAnchor = (anchorSelector: string) => {
  state.root = anchorSelector;
};

const ContextMenuWrapper: React.FC<Props> = ({
  customBody,
  level,
  children,
  hookProps,
  positionPreferences,
  items,
  clickOutsideSelectorsWhitelist,
  showAsModal,
  style,
}) => {
  const { position, show, hide, shown } = useChildContextMenu(
    hookProps,
    positionPreferences,
  );

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
      {children({ shown, show: showM, hide })}
      <Portal targetSelector={state.root}>
        {shown && (
          <ContextMenu
            items={items}
            hide={hide}
            level={level}
            position={position}
            id={id.current.id}
            context={id.current.context}
            clickOutsideSelectorsWhitelist={clickOutsideSelectorsWhitelist}
            showAsModal={showAsModal}
            style={style}
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
