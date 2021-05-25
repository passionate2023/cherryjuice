import modSpinnerCircle from '::sass-modules/shared-components/spinner-circle.scss';
import * as React from 'react';

type Props = {
  progress?: number;
  size?: number;
  stroke?: string;
  className?: string;
};

const strokeDasharray = 187;
const ProgressCircle: React.FC<Props> = ({
  progress = 0,
  size = 30,
  stroke = 'var(--on-surface-060)',
  className = '',
  children,
}) => {
  const strokeDashoffset =
    strokeDasharray - Math.min(progress, 1) * strokeDasharray;
  return (
    <span className={modSpinnerCircle.container + ' ' + className}>
      {
        <svg
          className={modSpinnerCircle.circleContainer + ' ' + className}
          width={size}
          height={size}
          viewBox="0 0 66 66"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className={modSpinnerCircle.circle}
            fill="none"
            strokeWidth="4"
            stroke={progress ? stroke : undefined}
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            cx="33"
            cy="33"
            r="30"
          />
        </svg>
      }
      <span>{children}</span>
    </span>
  );
};

export { ProgressCircle };
