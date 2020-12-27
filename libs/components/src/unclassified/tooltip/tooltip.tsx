import * as React from 'react';

export type LabelPosition =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export type TooltipProps = {
  label?: string;
  position?: LabelPosition;
  show?: boolean;
};

const Tooltip: React.FC<TooltipProps> = ({
  show = true,
  position = 'bottom',
  label,
  children,
}) => {
  const isTouchScreen = 'ontouchstart' in window;

  return show && label ? (
    <div
      aria-label={label}
      className={!isTouchScreen ? 'hint--' + position : undefined}
      title={isTouchScreen ? label : undefined}
    >
      {children}
    </div>
  ) : (
    <>{children}</>
  );
};

export { Tooltip };
