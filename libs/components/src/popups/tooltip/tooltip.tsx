import * as React from 'react';
import { ContextMenuWrapper } from '::root/popups/context-menu/context-menu-wrapper';
import { useRef } from 'react';
import mod from './tooltip.scss';
const state = { tooltips: 0 };
type TooltipProps = {
  tooltip?: string;
  show?: boolean;
};

const Tooltip: React.FC<
  TooltipProps & { children: (props: any) => JSX.Element }
> = ({ show = true, tooltip, children }) => {
  const id = useRef(0);
  if (!id.current) id.current = Date.now() + state.tooltips++;
  return !(show && tooltip) ? (
    children({})
  ) : (
    <>
      <ContextMenuWrapper
        customBody={() => <div className={mod.tooltip}>{tooltip}</div>}
        hookProps={{
          getIdOfActiveElement: () => 'tooltip',
          getActiveElement: () =>
            document.querySelector(`[data-tooltip-id="${id.current}"]`),
        }}
        positionPreferences={{
          positionX: 'll',
          positionY: 'bt',
          offsetX: 3,
          offsetY: 3,
        }}
        style={{ paddingTop: 0, paddingBottom: 0, opacity: 0.95 }}
        level={-1}
      >
        {({ show, hide }) => {
          return children({
            'data-tooltip-id': id.current,
            onMouseEnter: show,
            onMouseLeave: hide,
          });
        }}
      </ContextMenuWrapper>
    </>
  );
};

export { Tooltip };
