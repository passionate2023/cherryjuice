import React from 'react';
import { useRef } from 'react';
import {
  useClickOutsideModal,
  joinClassNames,
  useModalKeyboardEvents,
  useCurrentBreakpoint,
} from '@cherryjuice/shared-helpers';
import { Scrim } from '::root/popups/scrim/scrim';
import { useCalculateElementPosition } from '::root/popups/popper/components/hooks/calculate-element-position/calculate-element-position';
import mod from './popper-body.scss';

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

type PopperBodyStyle = {
  borderRadius?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  opacity?: number;
};
export type PopperBodyProps = {
  hide: () => void;
  level?: number;
  position: Position;
  showAsModal?: 'tb' | 'mb';
  clickOutsideSelectorsWhitelist?: any[];
  style?: PopperBodyStyle;
};

const PopperBody: React.FC<PopperBodyProps> = ({
  hide,
  position,
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
        selector: '.' + mod.popperBody,
      },
    ],
  });
  const keprops = useModalKeyboardEvents({
    dismiss: hide,
    focusableElementsSelector: [],
  });

  const { x, y } = useCalculateElementPosition(position, ref);
  const breakpoint = useCurrentBreakpoint();
  return (
    <>
      {!!breakpoint[showAsModal] && (
        <Scrim onClick={hide} isShownOnTopOfDialog={true} />
      )}
      <div
        {...clkOProps}
        {...keprops}
        className={joinClassNames([
          mod.popperBody,
          [mod.popperBodyModal, !!breakpoint[showAsModal]],
        ])}
        style={
          breakpoint[showAsModal]
            ? { ...style }
            : {
                left: Math.max(x, 0),
                top: Math.max(y, 0),
                ...style,
              }
        }
        ref={ref}
      >
        {children}
      </div>
    </>
  );
};

export { PopperBody };
