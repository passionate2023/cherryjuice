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
};

const Tooltip: React.FC<Props> = ({position = 'bottom', label, children}) => {
  const isTouchScreen = 'ontouchstart' in window;

  return (
      <div
          aria-label={label}
          className={!isTouchScreen && 'hint--' + position}
          title={isTouchScreen && label}
      >
        {children}
      </div>
  );
};

export {Tooltip};
