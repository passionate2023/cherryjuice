import * as React from 'react';
import {
  PopperBody,
  PopperBodyProps,
} from '::root/popups/popper/components/popper-body';
import { useEffect, useRef, MouseEvent } from 'react';
import { Portal } from '::root/unclassified/portal/portal';
import {
  PopperContextProps,
  PositionPreferences,
  usePopperContext,
} from '::root/popups/popper/hooks/popper-context';
type RenderPopperBody = ({ hide, context, level, id }) => JSX.Element;
export type PopperAnchor = (props: {
  show: (e: MouseEvent<HTMLDivElement>) => void;
  hide: () => void;
  shown: boolean;
}) => JSX.Element;

type Props = {
  getContext: PopperContextProps;
  body?: JSX.Element | RenderPopperBody;
  positionPreferences?: PositionPreferences;
  children: PopperAnchor;
};
export type PopperProps = Props &
  Pick<
    PopperBodyProps,
    'clickOutsideSelectorsWhitelist' | 'showAsModal' | 'level' | 'style'
  >;

const state = {
  root: '',
  hide: new Map<number, Set<() => undefined>>(),
};
export const setPopperAnchor = (anchorSelector: string) => {
  state.root = anchorSelector;
};

const Popper: React.FC<PopperProps> = ({
  body,
  level,
  children,
  getContext,
  positionPreferences,
  clickOutsideSelectorsWhitelist,
  showAsModal,
  style,
}) => {
  const { position, show, hide, shown } = usePopperContext(
    getContext,
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
          <PopperBody
            hide={hide}
            level={level}
            position={position}
            clickOutsideSelectorsWhitelist={clickOutsideSelectorsWhitelist}
            showAsModal={showAsModal}
            style={style}
          >
            {typeof body === 'function'
              ? body({
                  hide,
                  context: id.current.context,
                  id: id.current.id,
                  level,
                })
              : body}
          </PopperBody>
        )}
      </Portal>
    </>
  );
};

export { Popper };
