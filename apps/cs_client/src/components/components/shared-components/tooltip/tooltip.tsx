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

type Props = {
  label?: string;
  position?: LabelPosition;
  show?: boolean;
};

const Tooltip: React.FC<Props> = ({
  show = true,
  position = 'bottom',
  label,
  children,
}) => {
  const isTouchScreen = 'ontouchstart' in window;

  return show ? (
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
